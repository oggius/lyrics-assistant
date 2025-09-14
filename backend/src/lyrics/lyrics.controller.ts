import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LyricsService } from './lyrics.service';

@ApiTags('lyrics')
@Controller('lyrics')
export class LyricsController {
  constructor(private readonly lyricsService: LyricsService) {}

  // Lyrics search endpoints will be implemented in task 6
  // Currently no endpoints are exposed to avoid confusion in API documentation
}