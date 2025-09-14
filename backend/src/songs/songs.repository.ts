import { Injectable, Inject } from '@nestjs/common';
import { eq, ilike, or, and, desc } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database.module';
import { Database } from '../database/connection';
import { songs, Song, NewSong, validateScrollSpeed, validateScrollStartDelay } from '../database/schema';
import { CreateSongDto, UpdateSongDto, SearchSongsDto } from './dto';

@Injectable()
export class SongsRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: Database,
  ) {}

  async create(createSongDto: CreateSongDto): Promise<Song> {
    // Validate scroll settings
    if (createSongDto.scrollSpeed !== undefined && !validateScrollSpeed(createSongDto.scrollSpeed)) {
      throw new Error('Scroll speed must be an integer between 1 and 10');
    }
    
    if (createSongDto.scrollStartDelay !== undefined && !validateScrollStartDelay(createSongDto.scrollStartDelay)) {
      throw new Error('Scroll start delay must be a non-negative integer');
    }

    const newSong: NewSong = {
      title: createSongDto.title.trim(),
      author: createSongDto.author?.trim() || null,
      lyrics: createSongDto.lyrics.trim(),
      scrollStartDelay: createSongDto.scrollStartDelay ?? 0,
      scrollSpeed: createSongDto.scrollSpeed ?? 5,
    };

    const [createdSong] = await this.db
      .insert(songs)
      .values(newSong)
      .returning();

    return createdSong;
  }

  async findAll(): Promise<Song[]> {
    return await this.db
      .select()
      .from(songs)
      .orderBy(desc(songs.createdAt));
  }

  async findById(id: string): Promise<Song | null> {
    const [song] = await this.db
      .select()
      .from(songs)
      .where(eq(songs.id, id))
      .limit(1);

    return song || null;
  }

  async search(searchDto: SearchSongsDto): Promise<Song[]> {
    const conditions = [];

    // General search across title and author
    if (searchDto.query) {
      const searchTerm = `%${searchDto.query.trim()}%`;
      conditions.push(
        or(
          ilike(songs.title, searchTerm),
          ilike(songs.author, searchTerm)
        )
      );
    }

    // Specific title search
    if (searchDto.title) {
      conditions.push(ilike(songs.title, `%${searchDto.title.trim()}%`));
    }

    // Specific author search
    if (searchDto.author) {
      conditions.push(ilike(songs.author, `%${searchDto.author.trim()}%`));
    }

    if (conditions.length > 0) {
      return await this.db
        .select()
        .from(songs)
        .where(and(...conditions))
        .orderBy(desc(songs.createdAt));
    }

    return await this.db
      .select()
      .from(songs)
      .orderBy(desc(songs.createdAt));
  }

  async update(id: string, updateSongDto: UpdateSongDto): Promise<Song | null> {
    // Validate scroll settings if provided
    if (updateSongDto.scrollSpeed !== undefined && !validateScrollSpeed(updateSongDto.scrollSpeed)) {
      throw new Error('Scroll speed must be an integer between 1 and 10');
    }
    
    if (updateSongDto.scrollStartDelay !== undefined && !validateScrollStartDelay(updateSongDto.scrollStartDelay)) {
      throw new Error('Scroll start delay must be a non-negative integer');
    }

    // Build update object with only provided fields
    const updateData: Partial<NewSong> = {
      updatedAt: new Date(),
    };

    if (updateSongDto.title !== undefined) {
      updateData.title = updateSongDto.title.trim();
    }
    
    if (updateSongDto.author !== undefined) {
      updateData.author = updateSongDto.author?.trim() || null;
    }
    
    if (updateSongDto.lyrics !== undefined) {
      updateData.lyrics = updateSongDto.lyrics.trim();
    }
    
    if (updateSongDto.scrollStartDelay !== undefined) {
      updateData.scrollStartDelay = updateSongDto.scrollStartDelay;
    }
    
    if (updateSongDto.scrollSpeed !== undefined) {
      updateData.scrollSpeed = updateSongDto.scrollSpeed;
    }

    const [updatedSong] = await this.db
      .update(songs)
      .set(updateData)
      .where(eq(songs.id, id))
      .returning();

    return updatedSong || null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db
      .delete(songs)
      .where(eq(songs.id, id))
      .returning({ id: songs.id });

    return result.length > 0;
  }

  async exists(id: string): Promise<boolean> {
    const [song] = await this.db
      .select({ id: songs.id })
      .from(songs)
      .where(eq(songs.id, id))
      .limit(1);

    return !!song;
  }

  async count(): Promise<number> {
    const [result] = await this.db
      .select({ count: songs.id })
      .from(songs);

    return Number(result.count) || 0;
  }
}