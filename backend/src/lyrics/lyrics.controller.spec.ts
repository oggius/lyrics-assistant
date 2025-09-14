import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { LyricsController } from './lyrics.controller';
import { LyricsService } from './lyrics.service';
import { SearchLyricsDto, LyricsResponseDto } from './dto';

describe('LyricsController', () => {
  let controller: LyricsController;
  let service: LyricsService;

  const mockLyricsService = {
    search: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LyricsController],
      providers: [
        {
          provide: LyricsService,
          useValue: mockLyricsService,
        },
      ],
    }).compile();

    controller = module.get<LyricsController>(LyricsController);
    service = module.get<LyricsService>(LyricsService);

    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('searchLyrics', () => {
    const mockSearchDto: SearchLyricsDto = {
      title: 'Amazing Grace',
      author: 'John Newton',
    };

    const mockLyricsResponse: LyricsResponseDto = {
      lyrics: 'Amazing grace, how sweet the sound\nThat saved a wretch like me\nI once was lost, but now am found\nWas blind, but now I see',
      source: 'Perplexity AI',
      confidence: 0.95,
    };

    it('should successfully search for lyrics', async () => {
      mockLyricsService.search.mockResolvedValue(mockLyricsResponse);

      const result = await controller.searchLyrics(mockSearchDto);

      expect(result).toEqual(mockLyricsResponse);
      expect(service.search).toHaveBeenCalledWith(mockSearchDto);
      expect(service.search).toHaveBeenCalledTimes(1);
    });

    it('should handle search with title only', async () => {
      const searchDtoTitleOnly: SearchLyricsDto = {
        title: 'Amazing Grace',
      };

      mockLyricsService.search.mockResolvedValue(mockLyricsResponse);

      const result = await controller.searchLyrics(searchDtoTitleOnly);

      expect(result).toEqual(mockLyricsResponse);
      expect(service.search).toHaveBeenCalledWith(searchDtoTitleOnly);
    });

    it('should propagate service errors', async () => {
      const serviceError = new HttpException(
        'Lyrics not found for the specified song',
        HttpStatus.NOT_FOUND
      );

      mockLyricsService.search.mockRejectedValue(serviceError);

      await expect(controller.searchLyrics(mockSearchDto)).rejects.toThrow(serviceError);
      expect(service.search).toHaveBeenCalledWith(mockSearchDto);
    });

    it('should handle unauthorized errors', async () => {
      const unauthorizedError = new HttpException(
        'Invalid Perplexity API key',
        HttpStatus.UNAUTHORIZED
      );

      mockLyricsService.search.mockRejectedValue(unauthorizedError);

      await expect(controller.searchLyrics(mockSearchDto)).rejects.toThrow(unauthorizedError);
    });

    it('should handle rate limit errors', async () => {
      const rateLimitError = new HttpException(
        'Rate limit exceeded. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS
      );

      mockLyricsService.search.mockRejectedValue(rateLimitError);

      await expect(controller.searchLyrics(mockSearchDto)).rejects.toThrow(rateLimitError);
    });

    it('should handle service unavailable errors', async () => {
      const serviceUnavailableError = new HttpException(
        'Perplexity API key not configured',
        HttpStatus.SERVICE_UNAVAILABLE
      );

      mockLyricsService.search.mockRejectedValue(serviceUnavailableError);

      await expect(controller.searchLyrics(mockSearchDto)).rejects.toThrow(serviceUnavailableError);
    });

    it('should handle internal server errors', async () => {
      const internalError = new HttpException(
        'Internal server error during lyrics search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );

      mockLyricsService.search.mockRejectedValue(internalError);

      await expect(controller.searchLyrics(mockSearchDto)).rejects.toThrow(internalError);
    });

    it('should handle bad gateway errors', async () => {
      const badGatewayError = new HttpException(
        'Perplexity API is temporarily unavailable',
        HttpStatus.BAD_GATEWAY
      );

      mockLyricsService.search.mockRejectedValue(badGatewayError);

      await expect(controller.searchLyrics(mockSearchDto)).rejects.toThrow(badGatewayError);
    });
  });
});