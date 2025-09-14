import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { SongsRepository } from './songs.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SongsController],
  providers: [SongsRepository, SongsService],
  exports: [SongsService, SongsRepository],
})
export class SongsModule {}