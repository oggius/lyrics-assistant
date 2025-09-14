import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, Max, IsNotEmpty, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSongDto {
  @ApiProperty({
    description: 'The title of the song',
    example: 'Amazing Grace',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  title: string;

  @ApiProperty({
    description: 'The author/artist of the song',
    example: 'John Newton',
    required: false,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  author?: string;

  @ApiProperty({
    description: 'The complete lyrics of the song',
    example: 'Amazing grace, how sweet the sound\nThat saved a wretch like me...',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  lyrics: string;

  @ApiProperty({
    description: 'Delay in seconds before auto-scroll starts',
    example: 3,
    default: 0,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  scrollStartDelay?: number = 0;

  @ApiProperty({
    description: 'Auto-scroll speed (1-10, where 1 is slowest and 10 is fastest)',
    example: 5,
    default: 5,
    minimum: 1,
    maximum: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  scrollSpeed?: number = 5;
}