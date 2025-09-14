import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SongsService } from './songs.service';

@ApiTags('songs')
@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  // Songs endpoints will be implemented in task 4 and 5
  // Currently no endpoints are exposed to avoid confusion in API documentation
}