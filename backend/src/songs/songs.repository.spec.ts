import { Test, TestingModule } from '@nestjs/testing';
import { SongsRepository } from './songs.repository';
import { CreateSongDto, UpdateSongDto, SearchSongsDto } from './dto';
import { DATABASE_CONNECTION } from '../database/database.module';
import { Song } from '../database/schema';

// Mock database
const mockDb = {
  insert: jest.fn(),
  select: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// Mock query builder methods
const mockQueryBuilder = {
  values: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
};

// Setup mock implementations
mockDb.insert.mockReturnValue(mockQueryBuilder);
mockDb.select.mockReturnValue(mockQueryBuilder);
mockDb.update.mockReturnValue(mockQueryBuilder);
mockDb.delete.mockReturnValue(mockQueryBuilder);

describe('SongsRepository', () => {
  let repository: SongsRepository;

  const mockSong: Song = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Song',
    author: 'Test Author',
    lyrics: 'Test lyrics content',
    scrollStartDelay: 0,
    scrollSpeed: 5,
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-01T00:00:00Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsRepository,
        {
          provide: DATABASE_CONNECTION,
          useValue: mockDb,
        },
      ],
    }).compile();

    repository = module.get<SongsRepository>(SongsRepository);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a song with valid data', async () => {
      const createSongDto: CreateSongDto = {
        title: 'Test Song',
        author: 'Test Author',
        lyrics: 'Test lyrics content',
        scrollStartDelay: 0,
        scrollSpeed: 5,
      };

      mockQueryBuilder.returning.mockResolvedValue([mockSong]);

      const result = await repository.create(createSongDto);

      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockQueryBuilder.values).toHaveBeenCalledWith({
        title: 'Test Song',
        author: 'Test Author',
        lyrics: 'Test lyrics content',
        scrollStartDelay: 0,
        scrollSpeed: 5,
      });
      expect(result).toEqual(mockSong);
    });

    it('should create a song with default values when optional fields are not provided', async () => {
      const createSongDto: CreateSongDto = {
        title: 'Test Song',
        lyrics: 'Test lyrics content',
      };

      mockQueryBuilder.returning.mockResolvedValue([mockSong]);

      await repository.create(createSongDto);

      expect(mockQueryBuilder.values).toHaveBeenCalledWith({
        title: 'Test Song',
        author: null,
        lyrics: 'Test lyrics content',
        scrollStartDelay: 0,
        scrollSpeed: 5,
      });
    });

    it('should trim whitespace from string fields', async () => {
      const createSongDto: CreateSongDto = {
        title: '  Test Song  ',
        author: '  Test Author  ',
        lyrics: '  Test lyrics content  ',
      };

      mockQueryBuilder.returning.mockResolvedValue([mockSong]);

      await repository.create(createSongDto);

      expect(mockQueryBuilder.values).toHaveBeenCalledWith({
        title: 'Test Song',
        author: 'Test Author',
        lyrics: 'Test lyrics content',
        scrollStartDelay: 0,
        scrollSpeed: 5,
      });
    });

    it('should throw error for invalid scroll speed', async () => {
      const createSongDto: CreateSongDto = {
        title: 'Test Song',
        lyrics: 'Test lyrics content',
        scrollSpeed: 11, // Invalid: > 10
      };

      await expect(repository.create(createSongDto)).rejects.toThrow(
        'Scroll speed must be an integer between 1 and 10'
      );
    });

    it('should throw error for invalid scroll start delay', async () => {
      const createSongDto: CreateSongDto = {
        title: 'Test Song',
        lyrics: 'Test lyrics content',
        scrollStartDelay: -1, // Invalid: negative
      };

      await expect(repository.create(createSongDto)).rejects.toThrow(
        'Scroll start delay must be a non-negative integer'
      );
    });
  });

  describe('findAll', () => {
    it('should return all songs ordered by creation date', async () => {
      const songs = [mockSong];
      mockQueryBuilder.orderBy.mockResolvedValue(songs);

      const result = await repository.findAll();

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockQueryBuilder.from).toHaveBeenCalled();
      expect(mockQueryBuilder.orderBy).toHaveBeenCalled();
      expect(result).toEqual(songs);
    });
  });

  describe('findById', () => {
    it('should return a song when found', async () => {
      mockQueryBuilder.limit.mockResolvedValue([mockSong]);

      const result = await repository.findById('123e4567-e89b-12d3-a456-426614174000');

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockQueryBuilder.where).toHaveBeenCalled();
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockSong);
    });

    it('should return null when song not found', async () => {
      mockQueryBuilder.limit.mockResolvedValue([]);

      const result = await repository.findById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('search', () => {
    it('should search by general query', async () => {
      const searchDto: SearchSongsDto = { query: 'test' };
      const songs = [mockSong];
      mockQueryBuilder.orderBy.mockResolvedValue(songs);

      const result = await repository.search(searchDto);

      expect(mockQueryBuilder.where).toHaveBeenCalled();
      expect(result).toEqual(songs);
    });

    it('should search by specific title', async () => {
      const searchDto: SearchSongsDto = { title: 'Test Song' };
      const songs = [mockSong];
      mockQueryBuilder.orderBy.mockResolvedValue(songs);

      const result = await repository.search(searchDto);

      expect(mockQueryBuilder.where).toHaveBeenCalled();
      expect(result).toEqual(songs);
    });

    it('should search by specific author', async () => {
      const searchDto: SearchSongsDto = { author: 'Test Author' };
      const songs = [mockSong];
      mockQueryBuilder.orderBy.mockResolvedValue(songs);

      const result = await repository.search(searchDto);

      expect(mockQueryBuilder.where).toHaveBeenCalled();
      expect(result).toEqual(songs);
    });

    it('should return all songs when no search criteria provided', async () => {
      const searchDto: SearchSongsDto = {};
      const songs = [mockSong];
      mockQueryBuilder.orderBy.mockResolvedValue(songs);

      const result = await repository.search(searchDto);

      expect(result).toEqual(songs);
    });
  });

  describe('update', () => {
    it('should update a song with valid data', async () => {
      const updateSongDto: UpdateSongDto = {
        title: 'Updated Song',
        lyrics: 'Updated lyrics',
      };

      mockQueryBuilder.returning.mockResolvedValue([{ ...mockSong, ...updateSongDto }]);

      const result = await repository.update('123e4567-e89b-12d3-a456-426614174000', updateSongDto);

      expect(mockDb.update).toHaveBeenCalled();
      expect(mockQueryBuilder.set).toHaveBeenCalled();
      expect(mockQueryBuilder.where).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should return null when song not found for update', async () => {
      const updateSongDto: UpdateSongDto = { title: 'Updated Song' };
      mockQueryBuilder.returning.mockResolvedValue([]);

      const result = await repository.update('nonexistent-id', updateSongDto);

      expect(result).toBeNull();
    });

    it('should throw error for invalid scroll speed in update', async () => {
      const updateSongDto: UpdateSongDto = {
        scrollSpeed: 0, // Invalid: < 1
      };

      await expect(repository.update('123e4567-e89b-12d3-a456-426614174000', updateSongDto))
        .rejects.toThrow('Scroll speed must be an integer between 1 and 10');
    });
  });

  describe('delete', () => {
    it('should delete a song and return true when successful', async () => {
      mockQueryBuilder.returning.mockResolvedValue([{ id: '123e4567-e89b-12d3-a456-426614174000' }]);

      const result = await repository.delete('123e4567-e89b-12d3-a456-426614174000');

      expect(mockDb.delete).toHaveBeenCalled();
      expect(mockQueryBuilder.where).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false when song not found for deletion', async () => {
      mockQueryBuilder.returning.mockResolvedValue([]);

      const result = await repository.delete('nonexistent-id');

      expect(result).toBe(false);
    });
  });

  describe('exists', () => {
    it('should return true when song exists', async () => {
      mockQueryBuilder.limit.mockResolvedValue([{ id: '123e4567-e89b-12d3-a456-426614174000' }]);

      const result = await repository.exists('123e4567-e89b-12d3-a456-426614174000');

      expect(result).toBe(true);
    });

    it('should return false when song does not exist', async () => {
      mockQueryBuilder.limit.mockResolvedValue([]);

      const result = await repository.exists('nonexistent-id');

      expect(result).toBe(false);
    });
  });

  describe('count', () => {
    it('should return the count of songs', async () => {
      mockDb.select.mockReturnValue({
        from: jest.fn().mockResolvedValue([{ count: '5' }]),
      });

      const result = await repository.count();

      expect(result).toBe(5);
    });

    it('should return 0 when no songs exist', async () => {
      mockDb.select.mockReturnValue({
        from: jest.fn().mockResolvedValue([{ count: null }]),
      });

      const result = await repository.count();

      expect(result).toBe(0);
    });
  });
});