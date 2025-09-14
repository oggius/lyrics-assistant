import { ApiProperty } from '@nestjs/swagger';

export class LyricsResponseDto {
  @ApiProperty({
    description: 'The lyrics content found for the song',
    example: 'Amazing grace, how sweet the sound\nThat saved a wretch like me...',
  })
  lyrics: string;

  @ApiProperty({
    description: 'Source of the lyrics (optional)',
    example: 'Perplexity AI',
    required: false,
  })
  source?: string;

  @ApiProperty({
    description: 'Confidence score of the search result (0-1)',
    example: 0.95,
    minimum: 0,
    maximum: 1,
  })
  confidence: number;
}

export class LyricsSearchErrorDto {
  @ApiProperty({
    description: 'Error message',
    example: 'Lyrics not found for the specified song',
  })
  message: string;

  @ApiProperty({
    description: 'Error code',
    example: 'LYRICS_NOT_FOUND',
  })
  code: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 404,
  })
  statusCode: number;
}