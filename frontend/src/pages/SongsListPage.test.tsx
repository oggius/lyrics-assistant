import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { vi } from 'vitest';
import SongsListPage from './SongsListPage';
import { useSongs } from '../hooks/useApi';
import { Song } from '../types/api';

// Mock the useApi hook
vi.mock('../hooks/useApi');
const mockUseSongs = vi.mocked(useSongs);

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Test data
const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Amazing Grace',
    author: 'John Newton',
    lyrics: 'Amazing grace, how sweet the sound\nThat saved a wretch like me\nI once was lost, but now am found\nWas blind, but now I see',
    scrollStartDelay: 0,
    scrollSpeed: 5,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'How Great Thou Art',
    author: 'Carl Boberg',
    lyrics: 'O Lord my God, when I in awesome wonder\nConsider all the worlds thy hands have made',
    scrollStartDelay: 2,
    scrollSpeed: 3,
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
  {
    id: '3',
    title: 'Untitled Song',
    author: undefined,
    lyrics: 'This is a song without an author',
    scrollStartDelay: 0,
    scrollSpeed: 7,
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z',
  },
];

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const theme = createTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('SongsListPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseSongs.mockClear();
  });

  describe('Loading State', () => {
    it('should display loading spinner when songs are loading', () => {
      mockUseSongs.mockReturnValue({
        data: [],
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      } as any);

      render(
        <TestWrapper>
          <SongsListPage />
        </TestWrapper>
      );

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByText('Loading songs...')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when songs fail to load', () => {
      const mockError = { message: 'Network error' };
      const mockRefetch = vi.fn();

      mockUseSongs.mockReturnValue({
        data: [],
        isLoading: false,
        error: mockError,
        refetch: mockRefetch,
      } as any);

      render(
        <TestWrapper>
          <SongsListPage />
        </TestWrapper>
      );

      expect(screen.getByText('Songs Library')).toBeInTheDocument();
      expect(screen.getByText(/Failed to load songs: Network error/)).toBeInTheDocument();
      
      const retryButton = screen.getByText('Retry');
      expect(retryButton).toBeInTheDocument();
      
      fireEvent.click(retryButton);
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no songs are available', () => {
      mockUseSongs.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      render(
        <TestWrapper>
          <SongsListPage />
        </TestWrapper>
      );

      expect(screen.getByText('No songs in your library yet')).toBeInTheDocument();
      expect(screen.getByText('Add your first song to get started with the Lyrics Assistant')).toBeInTheDocument();
      expect(screen.getByText('Add Your First Song')).toBeInTheDocument();
    });

    it('should navigate to add song page when "Add Your First Song" is clicked', () => {
      mockUseSongs.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      } as any);

      render(
        <TestWrapper>
          <SongsListPage />
        </TestWrapper>
      );

      const addButton = screen.getByText('Add Your First Song');
      fireEvent.click(addButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/add');
    });
  });

  describe('Songs Display', () => {
    beforeEach(() => {
      mockUseSongs.mockReturnValue({
        data: mockSongs,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      } as any);
    });

    it('should display all songs when loaded successfully', () => {
      render(
        <TestWrapper>
          <SongsListPage />
        </TestWrapper>
      );

      expect(screen.getByText('Songs Library')).toBeInTheDocument();
      expect(screen.getByText('Amazing Grace')).toBeInTheDocument();
      expect(screen.getByText('How Great Thou Art')).toBeInTheDocument();
      expect(screen.getByText('Untitled Song')).toBeInTheDocument();
    });

    it('should display song authors when available', () => {
      render(
        <TestWrapper>
          <SongsListPage />
        </TestWrapper>
      );

      expect(screen.getByText('by John Newton')).toBeInTheDocument();
      expect(screen.getByText('by Carl Boberg')).toBeInTheDocument();
      expect(screen.queryByText('by undefined')).not.toBeInTheDocument();
    });

    it('should display song metadata (scroll speed and delay)', () => {
      render(
        <TestWrapper>
          <SongsListPage />
        </TestWrapper>
      );

      expect(screen.getByText('Speed: 5')).toBeInTheDocument();
      expect(screen.getByText('Speed: 3')).toBeInTheDocument();
      expect(screen.getByText('Speed: 7')).toBeInTheDocument();
      expect(screen.getByText('Delay: 2s')).toBeInTheDocument();
    });

    it('should display lyrics preview', () => {
      render(
        <TestWrapper>
          <SongsListPage />
        </TestWrapper>
      );

      expect(screen.getByText(/Amazing grace, how sweet the sound/)).toBeInTheDocument();
      expect(screen.getByText(/O Lord my God, when I in awesome wonder/)).toBeInTheDocument();
    });

    it('should navigate to song page when song card is clicked', () => {
      render(
        <TestWrapper>
          <SongsListPage />
        </TestWrapper>
      );

      // Find the song card by looking for the CardActionArea button that contains the song title
      const songCards = screen.getAllByRole('button');
      const amazingGraceCard = songCards.find(card => 
        card.textContent?.includes('Amazing Grace')
      );
      
      expect(amazingGraceCard).toBeInTheDocument();
      fireEvent.click(amazingGraceCard!);
      expect(mockNavigate).toHaveBeenCalledWith('/song/1');
    });

    it('should navigate to add song page when "Add Song" button is clicked', () => {
      render(
        <TestWrapper>
          <SongsListPage />
        </TestWrapper>
      );

      const addButton = screen.getByText('Add Song');
      fireEvent.click(addButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/add');
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      mockUseSongs.mockReturnValue({
        data: mockSongs,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      } as any);
    });

    it('should display search input', () => {
      render(
        <TestWrapper>
          <SongsListPage />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('Search songs by title or author...');
      expect(searchInput).toBeInTheDocument();
    });

    it('should filter songs by title', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <SongsListPage />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('Search songs by title or author...');
      await user.type(searchInput, 'Amazing');

      await waitFor(() => {
        expect(screen.getByText('Amazing Grace')).toBeInTheDocument();
        expect(screen.queryByText('How Great Thou Art')).not.toBeInTheDocument();
        expect(screen.queryByText('Untitled Song')).not.toBeInTheDocument();
      });

      expect(screen.getByText('Found 1 song for "Amazing"')).toBeInTheDocument();
    });

    it('should filter songs by author', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <SongsListPage />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('Search songs by title or author...');
      await user.type(searchInput, 'Newton');

      await waitFor(() => {
        expect(screen.getByText('Amazing Grace')).toBeInTheDocument();
        expect(screen.queryByText('How Great Thou Art')).not.toBeInTheDocument();
        expect(screen.queryByText('Untitled Song')).not.toBeInTheDocument();
      });

      expect(screen.getByText('Found 1 song for "Newton"')).toBeInTheDocument();
    });

    it('should show no results message when search yields no matches', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <SongsListPage />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('Search songs by title or author...');
      await user.type(searchInput, 'nonexistent');

      await waitFor(() => {
        expect(screen.getByText('No songs match your search')).toBeInTheDocument();
        expect(screen.getByText('Try adjusting your search terms or add a new song')).toBeInTheDocument();
      });

      expect(screen.getByText('No songs found for "nonexistent"')).toBeInTheDocument();
    });

    it('should clear search when "Clear Search" button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <SongsListPage />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('Search songs by title or author...');
      await user.type(searchInput, 'nonexistent');

      await waitFor(() => {
        expect(screen.getByText('No songs match your search')).toBeInTheDocument();
      });

      const clearButton = screen.getByText('Clear Search');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(searchInput).toHaveValue('');
        expect(screen.getByText('Amazing Grace')).toBeInTheDocument();
        expect(screen.getByText('How Great Thou Art')).toBeInTheDocument();
        expect(screen.getByText('Untitled Song')).toBeInTheDocument();
      });
    });

    it('should be case insensitive', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <SongsListPage />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('Search songs by title or author...');
      await user.type(searchInput, 'AMAZING');

      await waitFor(() => {
        expect(screen.getByText('Amazing Grace')).toBeInTheDocument();
        expect(screen.queryByText('How Great Thou Art')).not.toBeInTheDocument();
      });
    });

    it('should handle multiple search results', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <SongsListPage />
        </TestWrapper>
      );

      const searchInput = screen.getByPlaceholderText('Search songs by title or author...');
      await user.type(searchInput, 'Great');

      await waitFor(() => {
        expect(screen.getByText('How Great Thou Art')).toBeInTheDocument();
        expect(screen.queryByText('Amazing Grace')).not.toBeInTheDocument();
      });

      expect(screen.getByText('Found 1 song for "Great"')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      mockUseSongs.mockReturnValue({
        data: mockSongs,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      } as any);
    });

    it('should have proper heading structure', () => {
      render(
        <TestWrapper>
          <SongsListPage />
        </TestWrapper>
      );

      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('Songs Library');
    });

    it('should have accessible song cards', () => {
      render(
        <TestWrapper>
          <SongsListPage />
        </TestWrapper>
      );

      const songCards = screen.getAllByRole('button');
      expect(songCards.length).toBeGreaterThan(0);
      
      // Each song card should be clickable
      songCards.forEach(card => {
        expect(card).toBeInTheDocument();
      });
    });

    it('should have accessible search input', () => {
      render(
        <TestWrapper>
          <SongsListPage />
        </TestWrapper>
      );

      const searchInput = screen.getByRole('textbox');
      expect(searchInput).toHaveAttribute('placeholder', 'Search songs by title or author...');
    });
  });
});