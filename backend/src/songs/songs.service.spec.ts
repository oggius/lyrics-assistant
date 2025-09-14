import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsRepository } from './songs.repository';
import { CreateSongDto, UpdateSongDto, SearchSongsDto } from './dto';
import { Song } from '../database/schema';

describe('SongsService', () => {
  let service: SongsService;
  let repository: jest.Mocked<SongsRepository>;

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
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      search: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
      count: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongsService,
        {
          provide: SongsRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SongsService>(SongsService);
    repository = module.get(SongsRepository);
  });

  describe('create', () => {
    it('should create a song with valid data', async () => {
      const createSongDto: CreateSongDto = {
        title: 'Test Song',
        author: 'Test Author',
        lyrics: 'Test lyrics content',
      };

      repository.create.mockResolvedValue(mockSong);

      const result = await service.create(createSongDto);

      expect(repository.create).toHaveBeenCalledWith(createSongDto);
      expect(result).toEqual(mockSong);
    });

    it('should throw BadRequestException when title is empty', async () => {
      const createSongDto: CreateSongDto = {
        title: '',
        lyrics: 'Test lyrics content',
      };

      await expect(service.create(createSongDto)).rejects.toThrow(
        new BadRequestException('Song title is required')
      );

      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when title is only whitespace', async () => {
      const createSongDto: CreateSongDto = {
        title: '   ',
        lyrics: 'Test lyrics content',
      };

      await expect(service.create(createSongDto)).rejects.toThrow(
        new BadRequestException('Song title is required')
      );
    });

    it('should throw BadRequestException when lyrics are empty', async () => {
      const createSongDto: CreateSongDto = {
        title: 'Test Song',
        lyrics: '',
      };

      await expect(service.create(createSongDto)).rejects.toThrow(
        new BadRequestException('Song lyrics are required')
      );
    });

    it('should throw BadRequestException when lyrics are only whitespace', async () => {
      const createSongDto: CreateSongDto = {
        title: 'Test Song',
        lyrics: '   ',
      };

      await expect(service.create(createSongDto)).rejects.toThrow(
        new BadRequestException('Song lyrics are required')
      );
    });

    it('should handle repository validation errors', async () => {
      const createSongDto: CreateSongDto = {
        title: 'Test Song',
        lyrics: 'Test lyrics content',
        scrollSpeed: 11,
      };

      repository.create.mockRejectedValue(new Error('Scroll speed must be an integer between 1 and 10'));

      await expect(service.create(createSongDto)).rejects.toThrow(
        new BadRequestException('Scroll speed must be an integer between 1 and 10')
      );
    });
  });

  describe('findAll', () => {
    it('should return all songs', async () => {
      const songs = [mockSong];
      repository.findAll.mockResolvedValue(songs);

      const result = await service.findAll();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toEqual(songs);
    });

    it('should return empty array when no songs exist', async () => {
      repository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a song when found', async () => {
      repository.findById.mockResolvedValue(mockSong);

      const result = await service.findById('123e4567-e89b-12d3-a456-426614174000');

      expect(repository.findById).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
      expect(result).toEqual(mockSong);
    });

    it('should throw NotFoundException when song not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('nonexistent-id')).rejects.toThrow(
        new NotFoundException('Song with ID nonexistent-id not found')
      );
    });

    it('should throw BadRequestException when ID is empty', async () => {
      await expect(service.findById('')).rejects.toThrow(
        new BadRequestException('Song ID is required')
      );

      expect(repository.findById).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when ID is only whitespace', async () => {
      await expect(service.findById('   ')).rejects.toThrow(
        new BadRequestException('Song ID is required')
      );
    });
  });

  describe('search', () => {
    it('should search songs with query parameter', async () => {
      const searchDto: SearchSongsDto = { query: 'test' };
      const songs = [mockSong];
      repository.search.mockResolvedValue(songs);

      const result = await service.search(searchDto);

      expect(repository.search).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(songs);
    });

    it('should search songs with title parameter', async () => {
      const searchDto: SearchSongsDto = { title: 'Test Song' };
      const songs = [mockSong];
      repository.search.mockResolvedValue(songs);

      const result = await service.search(searchDto);

      expect(repository.search).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(songs);
    });

    it('should search songs with author parameter', async () => {
      const searchDto: SearchSongsDto = { author: 'Test Author' };
      const songs = [mockSong];
      repository.search.mockResolvedValue(songs);

      const result = await service.search(searchDto);

      expect(repository.search).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(songs);
    });

    it('should throw BadRequestException when no search parameters provided', async () => {
      const searchDto: SearchSongsDto = {};

      await expect(service.search(searchDto)).rejects.toThrow(
        new BadRequestException('At least one search parameter (query, title, or author) is required')
      );

      expect(repository.search).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when all search parameters are empty strings', async () => {
      const searchDto: SearchSongsDto = {
        query: '',
        title: '',
        author: '',
      };

      await expect(service.search(searchDto)).rejects.toThrow(
        new BadRequestException('At least one search parameter (query, title, or author) is required')
      );
    });

    it('should throw BadRequestException when all search parameters are whitespace', async () => {
      const searchDto: SearchSongsDto = {
        query: '   ',
        title: '   ',
        author: '   ',
      };

      await expect(service.search(searchDto)).rejects.toThrow(
        new BadRequestException('At least one search parameter (query, title, or author) is required')
      );
    });
  });

  describe('update', () => {
    it('should update a song with valid data', async () => {
      const updateSongDto: UpdateSongDto = {
        title: 'Updated Song',
        lyrics: 'Updated lyrics',
      };
      const updatedSong = { ...mockSong, ...updateSongDto };

      repository.exists.mockResolvedValue(true);
      repository.update.mockResolvedValue(updatedSong);

      const result = await service.update('123e4567-e89b-12d3-a456-426614174000', updateSongDto);

      expect(repository.exists).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
      expect(repository.update).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000', updateSongDto);
      expect(result).toEqual(updatedSong);
    });

    it('should throw BadRequestException when ID is empty', async () => {
      const updateSongDto: UpdateSongDto = { title: 'Updated Song' };

      await expect(service.update('', updateSongDto)).rejects.toThrow(
        new BadRequestException('Song ID is required')
      );

      expect(repository.exists).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when song does not exist', async () => {
      const updateSongDto: UpdateSongDto = { title: 'Updated Song' };

      repository.exists.mockResolvedValue(false);

      await expect(service.update('nonexistent-id', updateSongDto)).rejects.toThrow(
        new NotFoundException('Song with ID nonexistent-id not found')
      );

      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when no fields provided for update', async () => {
      const updateSongDto: UpdateSongDto = {};

      repository.exists.mockResolvedValue(true);

      await expect(service.update('123e4567-e89b-12d3-a456-426614174000', updateSongDto)).rejects.toThrow(
        new BadRequestException('At least one field must be provided for update')
      );

      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when title is empty string', async () => {
      const updateSongDto: UpdateSongDto = { title: '' };

      repository.exists.mockResolvedValue(true);

      await expect(service.update('123e4567-e89b-12d3-a456-426614174000', updateSongDto)).rejects.toThrow(
        new BadRequestException('Song title cannot be empty')
      );
    });

    it('should throw BadRequestException when lyrics are empty string', async () => {
      const updateSongDto: UpdateSongDto = { lyrics: '' };

      repository.exists.mockResolvedValue(true);

      await expect(service.update('123e4567-e89b-12d3-a456-426614174000', updateSongDto)).rejects.toThrow(
        new BadRequestException('Song lyrics cannot be empty')
      );
    });

    it('should handle repository validation errors', async () => {
      const updateSongDto: UpdateSongDto = { scrollSpeed: 11 };

      repository.exists.mockResolvedValue(true);
      repository.update.mockRejectedValue(new Error('Scroll speed must be an integer between 1 and 10'));

      await expect(service.update('123e4567-e89b-12d3-a456-426614174000', updateSongDto)).rejects.toThrow(
        new BadRequestException('Scroll speed must be an integer between 1 and 10')
      );
    });
  });

  describe('delete', () => {
    it('should delete a song successfully', async () => {
      repository.delete.mockResolvedValue(true);

      await service.delete('123e4567-e89b-12d3-a456-426614174000');

      expect(repository.delete).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should throw BadRequestException when ID is empty', async () => {
      await expect(service.delete('')).rejects.toThrow(
        new BadRequestException('Song ID is required')
      );

      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when song not found', async () => {
      repository.delete.mockResolvedValue(false);

      await expect(service.delete('nonexistent-id')).rejects.toThrow(
        new NotFoundException('Song with ID nonexistent-id not found')
      );
    });
  });

  describe('getCount', () => {
    it('should return the count of songs', async () => {
      repository.count.mockResolvedValue(5);

      const result = await service.getCount();

      expect(repository.count).toHaveBeenCalled();
      expect(result).toBe(5);
    });

    it('should return 0 when no songs exist', async () => {
      repository.count.mockResolvedValue(0);

      const result = await service.getCount();

      expect(result).toBe(0);
    });
  });
});