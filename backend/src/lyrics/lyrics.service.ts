import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { SearchLyricsDto, LyricsResponseDto } from './dto';

@Injectable()
export class LyricsService {
  private readonly logger = new Logger(LyricsService.name);
  private readonly openaiClient: OpenAI;
  private readonly perplexityApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.perplexityApiKey = this.configService.get<string>('perplexity.apiKey');
    const perplexityBaseUrl = this.configService.get<string>('perplexity.baseUrl');

    if (!this.perplexityApiKey) {
      this.logger.warn('Perplexity API key not configured. Lyrics search will not work.');
    }

    try {
      this.openaiClient = new OpenAI({
        apiKey: this.perplexityApiKey || 'dummy-key', // Provide dummy key to avoid initialization errors
        baseURL: perplexityBaseUrl,
      });
    } catch (error) {
      this.logger.error('Failed to initialize OpenAI client for Perplexity:', error);
      throw new Error('Failed to initialize Perplexity API client');
    }
  }

  async search(searchDto: SearchLyricsDto): Promise<LyricsResponseDto> {
    if (!this.perplexityApiKey) {
      throw new HttpException(
        'Perplexity API key not configured',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }

    try {
      const prompt = this.constructLyricsSearchPrompt(searchDto);
      this.logger.debug(`Searching lyrics for "${searchDto.title}"`);
      
      const response = await this.openaiClient.chat.completions.create({
        model: 'sonar', // Using sonar model for web search capabilities
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.1, // Low temperature for more consistent results
        top_p: 0.9,
        // Perplexity-specific parameters (cast to any to bypass TypeScript checks)
        ...({
          return_citations: false,
          search_domain_filter: ['genius.com', 'azlyrics.com', 'lyrics.com'],
          return_images: false,
          return_related_questions: false,
          search_recency_filter: 'month',
          top_k: 0,
          stream: false,
          presence_penalty: 0,
          frequency_penalty: 1,
        } as any),
      });

      const parsedResponse = this.parseAndCleanResponse(response);
      this.logger.log(`Successfully found lyrics for "${searchDto.title}"`);
      return parsedResponse;
    } catch (error) {
      this.logger.error(`Failed to search lyrics for "${searchDto.title}":`, error);
      
      if (error instanceof HttpException) {
        throw error;
      }

      return this.handleOpenAIError(error);
    }
  }

  private constructLyricsSearchPrompt(searchDto: SearchLyricsDto): string {
    const { title, author } = searchDto;
    
    let searchQuery = `lyrics for "${title}"`;
    if (author) {
      searchQuery += ` by ${author}`;
    }
    
    const prompt = `Find the complete ${searchQuery}.

IMPORTANT INSTRUCTIONS:
- Return ONLY the song lyrics, no additional commentary or information
- Do not include song title, artist name, or any metadata in the response
- Do not include verse/chorus labels or structural annotations like [Verse 1], [Chorus], etc.
- Do not include copyright information or disclaimers
- If the song has multiple verses and a chorus, include all of them in order
- Maintain the original line breaks and structure of the lyrics
- If you cannot find the exact lyrics, respond with "LYRICS_NOT_FOUND"
- Do not provide similar songs or alternatives
- Focus on finding the most accurate and complete version of the lyrics`;

    return prompt;
  }



  private parseAndCleanResponse(response: OpenAI.Chat.Completions.ChatCompletion): LyricsResponseDto {
    if (!response.choices || response.choices.length === 0) {
      throw new HttpException(
        'No response received from Perplexity API',
        HttpStatus.BAD_GATEWAY
      );
    }

    const content = response.choices[0].message?.content?.trim() || '';

    // Check if lyrics were not found
    if (content.includes('LYRICS_NOT_FOUND') || content.toLowerCase().includes('cannot find') || content.toLowerCase().includes('unable to find')) {
      throw new HttpException(
        'Lyrics not found for the specified song',
        HttpStatus.NOT_FOUND
      );
    }

    // Clean the response
    const cleanedLyrics = this.cleanLyricsContent(content);

    // Calculate confidence based on response quality
    const confidence = this.calculateConfidence(cleanedLyrics, response);

    return {
      lyrics: cleanedLyrics,
      source: 'Perplexity AI',
      confidence,
    };
  }

  private cleanLyricsContent(content: string): string {
    // Remove common prefixes and suffixes that might be added
    let cleaned = content
      .replace(/^(Here are the lyrics|The lyrics are|Lyrics:)/i, '')
      .replace(/^(to|for) ["'].*["']( by .*)?:?\s*/i, '')
      .replace(/\*\*.*?\*\*/g, '') // Remove bold markdown
      .replace(/^\s*[-*]\s*/gm, '') // Remove bullet points
      .replace(/^\s*\d+\.\s*/gm, '') // Remove numbered lists
      .trim();

    // Remove any remaining metadata lines
    const lines = cleaned.split('\n');
    const filteredLines = lines.filter(line => {
      const lowerLine = line.toLowerCase().trim();
      return !lowerLine.includes('copyright') &&
             !lowerLine.includes('©') &&
             !lowerLine.includes('all rights reserved') &&
             !lowerLine.includes('lyrics by') &&
             !lowerLine.includes('written by') &&
             !lowerLine.includes('composed by') &&
             !lowerLine.startsWith('song:') &&
             !lowerLine.startsWith('artist:') &&
             !lowerLine.startsWith('album:') &&
             line.trim().length > 0;
    });

    return filteredLines.join('\n').trim();
  }

  private calculateConfidence(lyrics: string, response: OpenAI.Chat.Completions.ChatCompletion): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence based on lyrics length (longer = more likely to be complete)
    if (lyrics.length > 500) confidence += 0.2;
    else if (lyrics.length > 200) confidence += 0.1;

    // Increase confidence if lyrics have typical song structure
    if (lyrics.includes('\n\n')) confidence += 0.1; // Has verse breaks
    if (lyrics.split('\n').length > 8) confidence += 0.1; // Has multiple lines

    // Decrease confidence if response seems incomplete or problematic
    if (lyrics.toLowerCase().includes('sorry') || 
        lyrics.toLowerCase().includes('cannot') ||
        lyrics.toLowerCase().includes('unable')) {
      confidence -= 0.3;
    }

    // Ensure confidence is within bounds
    return Math.max(0, Math.min(1, confidence));
  }

  private handleOpenAIError(error: any): never {
    this.logger.error('OpenAI/Perplexity API error:', error);

    // Handle OpenAI SDK errors
    if (error.status) {
      const status = error.status;
      const message = error.message || error.error?.message || 'Unknown error';

      switch (status) {
        case 401:
          throw new HttpException(
            'Invalid Perplexity API key',
            HttpStatus.UNAUTHORIZED
          );
        case 429:
          throw new HttpException(
            'Rate limit exceeded. Please try again later.',
            HttpStatus.TOO_MANY_REQUESTS
          );
        case 500:
        case 502:
        case 503:
        case 504:
          throw new HttpException(
            'Perplexity API is temporarily unavailable',
            HttpStatus.BAD_GATEWAY
          );
        default:
          throw new HttpException(
            `Perplexity API error: ${message}`,
            HttpStatus.BAD_GATEWAY
          );
      }
    }

    // Handle network or other errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      throw new HttpException(
        'Unable to reach Perplexity API',
        HttpStatus.BAD_GATEWAY
      );
    }

    // Generic error handling
    throw new HttpException(
      'Internal server error during lyrics search',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}