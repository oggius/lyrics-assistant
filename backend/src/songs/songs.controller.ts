import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { SongsService } from './songs.service';
import { CreateSongDto, UpdateSongDto, SearchSongsDto, SongResponseDto } from './dto';

@ApiTags('songs')
@Controller('songs')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all songs',
    description: 'Retrieve a list of all songs in the library, ordered by creation date (newest first)',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved all songs',
    type: [SongResponseDto],
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Amazing Grace',
        author: 'John Newton',
        lyrics: 'Amazing grace, how sweet the sound\nThat saved a wretch like me...',
        scrollStartDelay: 3,
        scrollSpeed: 5,
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z',
      },
    ],
  })
  async findAll(): Promise<SongResponseDto[]> {
    return await this.songsService.findAll();
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search songs',
    description: 'Search for songs by title, author, or general query. At least one search parameter is required.',
  })
  @ApiQuery({
    name: 'query',
    description: 'General search query that searches across title and author',
    required: false,
    example: 'Amazing',
  })
  @ApiQuery({
    name: 'title',
    description: 'Search specifically in song titles',
    required: false,
    example: 'Grace',
  })
  @ApiQuery({
    name: 'author',
    description: 'Search specifically in song authors',
    required: false,
    example: 'Newton',
  })
  @ApiOkResponse({
    description: 'Successfully found matching songs',
    type: [SongResponseDto],
  })
  @ApiBadRequestResponse({
    description: 'At least one search parameter is required',
    example: {
      statusCode: 400,
      message: 'At least one search parameter (query, title, or author) is required',
      error: 'Bad Request',
    },
  })
  async search(@Query() searchDto: SearchSongsDto): Promise<SongResponseDto[]> {
    return await this.songsService.search(searchDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get song by ID',
    description: 'Retrieve a specific song by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the song',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved the song',
    type: SongResponseDto,
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Amazing Grace',
      author: 'John Newton',
      lyrics: 'Amazing grace, how sweet the sound\nThat saved a wretch like me...',
      scrollStartDelay: 3,
      scrollSpeed: 5,
      createdAt: '2024-01-15T10:30:00.000Z',
      updatedAt: '2024-01-15T10:30:00.000Z',
    },
  })
  @ApiNotFoundResponse({
    description: 'Song not found',
    example: {
      statusCode: 404,
      message: 'Song with ID 123e4567-e89b-12d3-a456-426614174000 not found',
      error: 'Not Found',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid song ID format',
    example: {
      statusCode: 400,
      message: 'Song ID is required',
      error: 'Bad Request',
    },
  })
  async findById(@Param('id') id: string): Promise<SongResponseDto> {
    return await this.songsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new song',
    description: 'Add a new song to the library with lyrics and scroll configuration',
  })
  @ApiBody({
    type: CreateSongDto,
    description: 'Song data to create',
    examples: {
      'basic-song': {
        summary: 'Basic song with default settings',
        value: {
          title: 'Amazing Grace',
          author: 'John Newton',
          lyrics: 'Amazing grace, how sweet the sound\nThat saved a wretch like me...',
        },
      },
      'song-with-config': {
        summary: 'Song with custom scroll configuration',
        value: {
          title: 'How Great Thou Art',
          author: 'Carl Boberg',
          lyrics: 'O Lord my God, when I in awesome wonder\nConsider all the worlds thy hands have made...',
          scrollStartDelay: 5,
          scrollSpeed: 3,
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Song successfully created',
    type: SongResponseDto,
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Amazing Grace',
      author: 'John Newton',
      lyrics: 'Amazing grace, how sweet the sound\nThat saved a wretch like me...',
      scrollStartDelay: 0,
      scrollSpeed: 5,
      createdAt: '2024-01-15T10:30:00.000Z',
      updatedAt: '2024-01-15T10:30:00.000Z',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    example: {
      statusCode: 400,
      message: 'Song title is required',
      error: 'Bad Request',
    },
  })
  async create(@Body() createSongDto: CreateSongDto): Promise<SongResponseDto> {
    return await this.songsService.create(createSongDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an existing song',
    description: 'Update song details including title, author, lyrics, and scroll configuration',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the song to update',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateSongDto,
    description: 'Song data to update (only provided fields will be updated)',
    examples: {
      'update-title': {
        summary: 'Update only the title',
        value: {
          title: 'Amazing Grace (New Version)',
        },
      },
      'update-scroll-config': {
        summary: 'Update scroll configuration',
        value: {
          scrollStartDelay: 10,
          scrollSpeed: 8,
        },
      },
      'full-update': {
        summary: 'Update all fields',
        value: {
          title: 'Amazing Grace (Updated)',
          author: 'John Newton (Updated)',
          lyrics: 'Amazing grace, how sweet the sound\nThat saved a wretch like me...\n(Updated version)',
          scrollStartDelay: 5,
          scrollSpeed: 7,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Song successfully updated',
    type: SongResponseDto,
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Amazing Grace (Updated)',
      author: 'John Newton',
      lyrics: 'Amazing grace, how sweet the sound\nThat saved a wretch like me...',
      scrollStartDelay: 5,
      scrollSpeed: 7,
      createdAt: '2024-01-15T10:30:00.000Z',
      updatedAt: '2024-01-15T11:45:00.000Z',
    },
  })
  @ApiNotFoundResponse({
    description: 'Song not found',
    example: {
      statusCode: 404,
      message: 'Song with ID 123e4567-e89b-12d3-a456-426614174000 not found',
      error: 'Not Found',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or song ID',
    example: {
      statusCode: 400,
      message: 'At least one field must be provided for update',
      error: 'Bad Request',
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateSongDto: UpdateSongDto,
  ): Promise<SongResponseDto> {
    return await this.songsService.update(id, updateSongDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a song',
    description: 'Remove a song from the library permanently',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the song to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiNoContentResponse({
    description: 'Song successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Song not found',
    example: {
      statusCode: 404,
      message: 'Song with ID 123e4567-e89b-12d3-a456-426614174000 not found',
      error: 'Not Found',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid song ID',
    example: {
      statusCode: 400,
      message: 'Song ID is required',
      error: 'Bad Request',
    },
  })
  async delete(@Param('id') id: string): Promise<void> {
    return await this.songsService.delete(id);
  }
}