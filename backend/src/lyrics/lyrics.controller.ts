import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTooManyRequestsResponse,
  ApiServiceUnavailableResponse,
  ApiInternalServerErrorResponse
} from '@nestjs/swagger';
import { LyricsService } from './lyrics.service';
import { SearchLyricsDto, LyricsResponseDto, LyricsSearchErrorDto } from './dto';

@ApiTags('lyrics')
@Controller('lyrics')
export class LyricsController {
  constructor(private readonly lyricsService: LyricsService) {}

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Search for song lyrics',
    description: 'Search for lyrics using the Perplexity API. Provide song title and optionally the author to get the complete lyrics.',
  })
  @ApiBody({
    type: SearchLyricsDto,
    description: 'Song search parameters',
    examples: {
      'with-author': {
        summary: 'Search with title and author',
        description: 'Search for a song with both title and author specified',
        value: {
          title: 'Amazing Grace',
          author: 'John Newton'
        }
      },
      'title-only': {
        summary: 'Search with title only',
        description: 'Search for a song with only the title specified',
        value: {
          title: 'Bohemian Rhapsody'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Lyrics found successfully',
    type: LyricsResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request parameters',
    type: LyricsSearchErrorDto,
  })
  @ApiNotFoundResponse({
    description: 'Lyrics not found for the specified song',
    type: LyricsSearchErrorDto,
  })
  @ApiTooManyRequestsResponse({
    description: 'Rate limit exceeded',
    type: LyricsSearchErrorDto,
  })
  @ApiServiceUnavailableResponse({
    description: 'Perplexity API is unavailable or API key not configured',
    type: LyricsSearchErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: LyricsSearchErrorDto,
  })
  async searchLyrics(@Body() searchDto: SearchLyricsDto): Promise<LyricsResponseDto> {
    return this.lyricsService.search(searchDto);
  }
}