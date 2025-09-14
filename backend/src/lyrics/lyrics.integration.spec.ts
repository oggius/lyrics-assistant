import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { LyricsService } from './lyrics.service';
import { SearchLyricsDto } from './dto';

describe('LyricsService Integration', () => {
  let service: LyricsService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LyricsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'perplexity.apiKey':
                  return 'test-api-key';
                case 'perplexity.baseUrl':
                  return 'https://api.perplexity.ai';
                default:
                  return undefined;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<LyricsService>(LyricsService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should initialize OpenAI client correctly', () => {
    expect(service['openaiClient']).toBeDefined();
    expect(service['perplexityApiKey']).toBe('test-api-key');
  });

  it('should handle missing API key gracefully', async () => {
    // Create service with missing API key
    const serviceWithoutKey = new LyricsService({
      get: () => undefined,
    } as any);

    const searchDto: SearchLyricsDto = {
      title: 'Test Song',
    };

    await expect(serviceWithoutKey.search(searchDto)).rejects.toThrow(
      'Perplexity API key not configured'
    );
  });
});