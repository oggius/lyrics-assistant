import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SongsRepository, CreateSongDto, UpdateSongDto, SearchSongsDto } from './songs.repository';
import { Song } from '../database/schema';

@Injectable()
export class SongsService {
  constructor(private readonly songsRepository: SongsRepository) {}

  async create(createSongDto: CreateSongDto): Promise<Song> {
    // Validate required fields
    if (!createSongDto.title?.trim()) {
      throw new BadRequestException('Song title is required');
    }

    if (!createSongDto.lyrics?.trim()) {
      throw new BadRequestException('Song lyrics are required');
    }

    try {
      return await this.songsRepository.create(createSongDto);
    } catch (error) {
      if (error.message.includes('Scroll speed') || error.message.includes('Scroll start delay')) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  async findAll(): Promise<Song[]> {
    return await this.songsRepository.findAll();
  }

  async findById(id: string): Promise<Song> {
    if (!id?.trim()) {
      throw new BadRequestException('Song ID is required');
    }

    const song = await this.songsRepository.findById(id);
    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }

    return song;
  }

  async search(searchDto: SearchSongsDto): Promise<Song[]> {
    // Validate that at least one search parameter is provided
    if (!searchDto.query?.trim() && !searchDto.title?.trim() && !searchDto.author?.trim()) {
      throw new BadRequestException('At least one search parameter (query, title, or author) is required');
    }

    return await this.songsRepository.search(searchDto);
  }

  async update(id: string, updateSongDto: UpdateSongDto): Promise<Song> {
    if (!id?.trim()) {
      throw new BadRequestException('Song ID is required');
    }

    // Check if song exists
    const exists = await this.songsRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }

    // Validate that at least one field is being updated
    const hasUpdates = Object.keys(updateSongDto).some(key => 
      updateSongDto[key] !== undefined && updateSongDto[key] !== null
    );

    if (!hasUpdates) {
      throw new BadRequestException('At least one field must be provided for update');
    }

    // Validate required fields if they're being updated
    if (updateSongDto.title !== undefined && !updateSongDto.title?.trim()) {
      throw new BadRequestException('Song title cannot be empty');
    }

    if (updateSongDto.lyrics !== undefined && !updateSongDto.lyrics?.trim()) {
      throw new BadRequestException('Song lyrics cannot be empty');
    }

    try {
      const updatedSong = await this.songsRepository.update(id, updateSongDto);
      if (!updatedSong) {
        throw new NotFoundException(`Song with ID ${id} not found`);
      }
      return updatedSong;
    } catch (error) {
      if (error.message.includes('Scroll speed') || error.message.includes('Scroll start delay')) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    if (!id?.trim()) {
      throw new BadRequestException('Song ID is required');
    }

    const deleted = await this.songsRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
  }

  async getCount(): Promise<number> {
    return await this.songsRepository.count();
  }
}