import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchSongsDto {
  @ApiProperty({
    description: 'General search query that searches across title and author',
    example: 'Amazing',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  query?: string;

  @ApiProperty({
    description: 'Search specifically in song titles',
    example: 'Grace',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  title?: string;

  @ApiProperty({
    description: 'Search specifically in song authors',
    example: 'Newton',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  author?: string;
}