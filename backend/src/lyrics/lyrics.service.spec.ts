import { LyricsService } from './lyrics.service';
import OpenAI from 'openai';

// Mock OpenAI
jest.mock('openai');

describe('LyricsService', () => {
  let service: LyricsService;

  // Mock ConfigService
  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'perplexity.apiKey':
          return 'test-api-key';
        case 'perplexity.baseUrl':
          return 'https://api.perplexity.ai';
        default:
          return undefined;
      }
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new LyricsService(mockConfigService as any);
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  // Test utility methods that don't require HTTP calls
  describe('utility methods', () => {
    it('should construct prompt with title and author', () => {
      const searchDto = {
        title: 'Amazing Grace',
        author: 'John Newton',
      };

      const prompt = service['constructLyricsSearchPrompt'](searchDto);

      expect(prompt).toContain('lyrics for "Amazing Grace" by John Newton');
      expect(prompt).toContain('Return ONLY the song lyrics');
      expect(prompt).toContain('Do not include song title, artist name');
      expect(prompt).toContain('LYRICS_NOT_FOUND');
    });

    it('should construct prompt with title only', () => {
      const searchDto = {
        title: 'Amazing Grace',
      };

      const prompt = service['constructLyricsSearchPrompt'](searchDto);

      expect(prompt).toContain('lyrics for "Amazing Grace"');
      expect(prompt).not.toContain(' by ');
    });

    it('should clean lyrics content properly', () => {
      const dirtyContent = `Here are the lyrics to "Amazing Grace":

Amazing grace, how sweet the sound
That saved a wretch like me

**Verse 2:**
I once was lost, but now am found
Was blind, but now I see

© 2023 All rights reserved
Written by John Newton`;

      const cleaned = service['cleanLyricsContent'](dirtyContent);

      expect(cleaned).not.toContain('Here are the lyrics');
      expect(cleaned).not.toContain('**Verse 2:**');
      expect(cleaned).not.toContain('© 2023 All rights reserved');
      expect(cleaned).not.toContain('Written by John Newton');
      expect(cleaned).toContain('Amazing grace, how sweet the sound');
      expect(cleaned).toContain('I once was lost, but now am found');
    });

    it('should remove bullet points and numbered lists', () => {
      const content = `- Amazing grace, how sweet the sound
* That saved a wretch like me
1. I once was lost, but now am found
2. Was blind, but now I see`;

      const cleaned = service['cleanLyricsContent'](content);

      expect(cleaned).not.toContain('- ');
      expect(cleaned).not.toContain('* ');
      expect(cleaned).not.toContain('1. ');
      expect(cleaned).not.toContain('2. ');
      expect(cleaned).toContain('Amazing grace, how sweet the sound');
    });

    it('should calculate confidence within 0-1 bounds', () => {
      const mockResponse = {
        id: 'test-id',
        model: 'test-model',
        object: 'chat.completion' as const,
        created: 1234567890,
        choices: [],
        usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
      } as OpenAI.Chat.Completions.ChatCompletion;

      const shortLyrics = 'Short lyrics';
      const longLyrics = 'A'.repeat(600) + '\n\nVerse 2\n' + 'B'.repeat(200);

      const shortConfidence = service['calculateConfidence'](shortLyrics, mockResponse);
      const longConfidence = service['calculateConfidence'](longLyrics, mockResponse);

      expect(shortConfidence).toBeGreaterThanOrEqual(0);
      expect(shortConfidence).toBeLessThanOrEqual(1);
      expect(longConfidence).toBeGreaterThanOrEqual(0);
      expect(longConfidence).toBeLessThanOrEqual(1);
      expect(longConfidence).toBeGreaterThan(shortConfidence);
    });

    it('should return lower confidence for problematic content', () => {
      const mockResponse = {
        id: 'test-id',
        model: 'test-model',
        object: 'chat.completion' as const,
        created: 1234567890,
        choices: [],
        usage: { prompt_tokens: 100, completion_tokens: 50, total_tokens: 150 },
      } as OpenAI.Chat.Completions.ChatCompletion;

      const problematicLyrics = 'Sorry, I cannot find the lyrics for this song';
      const normalLyrics = 'Amazing grace, how sweet the sound\nThat saved a wretch like me';

      const problematicConfidence = service['calculateConfidence'](problematicLyrics, mockResponse);
      const normalConfidence = service['calculateConfidence'](normalLyrics, mockResponse);

      expect(problematicConfidence).toBeLessThan(normalConfidence);
    });
  });
});