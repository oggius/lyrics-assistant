import { ApiProperty } from '@nestjs/swagger';

export class SongResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the song',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The title of the song',
    example: 'Amazing Grace',
  })
  title: string;

  @ApiProperty({
    description: 'The author/artist of the song',
    example: 'John Newton',
    nullable: true,
  })
  author: string | null;

  @ApiProperty({
    description: 'The complete lyrics of the song',
    example: 'Amazing grace, how sweet the sound\nThat saved a wretch like me...',
  })
  lyrics: string;

  @ApiProperty({
    description: 'Delay in seconds before auto-scroll starts',
    example: 3,
  })
  scrollStartDelay: number;

  @ApiProperty({
    description: 'Auto-scroll speed (1-10, where 1 is slowest and 10 is fastest)',
    example: 5,
  })
  scrollSpeed: number;

  @ApiProperty({
    description: 'Timestamp when the song was created',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the song was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}