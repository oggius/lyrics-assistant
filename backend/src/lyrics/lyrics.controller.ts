import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LyricsService } from './lyrics.service';

@ApiTags('lyrics')
@Controller('lyrics')
export class LyricsController {
  constructor(private readonly lyricsService: LyricsService) {}

  @Post('search')
  @ApiOperation({ summary: 'Search for lyrics' })
  @ApiResponse({ status: 200, description: 'Return search results.' })
  search(@Body() searchDto: any) {
    return this.lyricsService.search(searchDto);
  }
}