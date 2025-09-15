import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { vi } from 'vitest';
import SongPage from './SongPage';
import * as useApiHooks from '../hooks/useApi';
import { Song } from '../types/api';

// Mock the useApi hooks
vi.mock('../hooks/useApi');
const mockUseSong = vi.mocked(useApiHooks.useSong);

// Create a theme for testing
const theme = createTheme();

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode; route?: string }> = ({ 
  children, 
  route = '/song/test-id' 
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/song/:id" element={children} />
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

// Mock song data
const mockSong: Song = {
  id: 'test-id',
  title: 'Amazing Grace',
  author: 'John Newton',
  lyrics: 'Amazing grace, how sweet the sound\nThat saved a wretch like me\n\nI once was lost, but now am found\nWas blind, but now I see',
  scrollStartDelay: 3,
  scrollSpeed: 5,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

describe('SongPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should display loading skeletons when song is loading', () => {
      mockUseSong.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        isError: false,
        isSuccess: false,
        refetch: vi.fn(),
      } as any);

      render(
        <TestWrapper>
          <SongPage />
        </TestWrapper>
      );

      // Check for skeleton loading elements - look for MuiSkeleton class
      const skeletons = document.querySelectorAll('.MuiSkeleton-root');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Error State', () => {
    it('should display error message when song loading fails', () => {
      const mockError = { message: 'Failed to load song' };
      mockUseSong.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
        isError: true,
        isSuccess: false,
        refetch: vi.fn(),
      } as any);

      render(
        <TestWrapper>
          <SongPage />
        </TestWrapper>
      );

      expect(screen.getByText('Failed to load song')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('should display default error message when error has no message', () => {
      const mockError = {};
      mockUseSong.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError,
        isError: true,
        isSuccess: false,
        refetch: vi.fn(),
      } as any);

      render(
        <TestWrapper>
          <SongPage />
        </TestWrapper>
      );

      expect(screen.getByText('Failed to load song. Please try again.')).toBeInTheDocument();
    });
  });

  describe('No Song Found', () => {
    it('should display warning when song data is null', () => {
      mockUseSong.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);

      render(
        <TestWrapper>
          <SongPage />
        </TestWrapper>
      );

      expect(screen.getByText(/Song not found/)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Successful Song Display', () => {
    beforeEach(() => {
      mockUseSong.mockReturnValue({
        data: mockSong,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);
    });

    it('should display song title and author', () => {
      render(
        <TestWrapper>
          <SongPage />
        </TestWrapper>
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Amazing Grace');
      expect(screen.getByText('John Newton')).toBeInTheDocument();
    });

    it('should display song metadata chips', () => {
      render(
        <TestWrapper>
          <SongPage />
        </TestWrapper>
      );

      expect(screen.getByText('Scroll Delay: 3s')).toBeInTheDocument();
      expect(screen.getByText('Scroll Speed: 5/10')).toBeInTheDocument();
    });

    it('should display formatted lyrics with proper line breaks', () => {
      render(
        <TestWrapper>
          <SongPage />
        </TestWrapper>
      );

      // Check that lyrics are displayed
      expect(screen.getByText('Amazing grace, how sweet the sound')).toBeInTheDocument();
      expect(screen.getByText('That saved a wretch like me')).toBeInTheDocument();
      expect(screen.getByText('I once was lost, but now am found')).toBeInTheDocument();
      expect(screen.getByText('Was blind, but now I see')).toBeInTheDocument();
    });

    it('should display lyrics section header', () => {
      render(
        <TestWrapper>
          <SongPage />
        </TestWrapper>
      );

      expect(screen.getByText('Lyrics')).toBeInTheDocument();
    });

    it('should handle song without author', () => {
      const songWithoutAuthor = { ...mockSong, author: undefined };
      mockUseSong.mockReturnValue({
        data: songWithoutAuthor,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);

      render(
        <TestWrapper>
          <SongPage />
        </TestWrapper>
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Amazing Grace');
      expect(screen.queryByText('John Newton')).not.toBeInTheDocument();
    });

    it('should handle empty lyrics gracefully', () => {
      const songWithEmptyLyrics = { ...mockSong, lyrics: '' };
      mockUseSong.mockReturnValue({
        data: songWithEmptyLyrics,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);

      render(
        <TestWrapper>
          <SongPage />
        </TestWrapper>
      );

      expect(screen.getByText('Lyrics')).toBeInTheDocument();
      // The lyrics section should still be present even if empty
    });

    it('should preserve empty lines in lyrics formatting', () => {
      const lyricsWithEmptyLines = 'Line 1\n\nLine 3\n\n\nLine 6';
      const songWithEmptyLines = { ...mockSong, lyrics: lyricsWithEmptyLines };
      mockUseSong.mockReturnValue({
        data: songWithEmptyLines,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);

      render(
        <TestWrapper>
          <SongPage />
        </TestWrapper>
      );

      expect(screen.getByText('Line 1')).toBeInTheDocument();
      expect(screen.getByText('Line 3')).toBeInTheDocument();
      expect(screen.getByText('Line 6')).toBeInTheDocument();
    });

    it('should display scroll controls', () => {
      render(
        <TestWrapper>
          <SongPage />
        </TestWrapper>
      );

      // Check for scroll control buttons
      expect(screen.getByRole('button', { name: /start scrolling/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /pause scrolling/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /stop scrolling/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /configure scroll settings/i })).toBeInTheDocument();
      
      // Check for scroll configuration display in the controls status
      expect(screen.getByText(/delay: 3s \| speed: 5\/10/i)).toBeInTheDocument();
    });
  });

  describe('Responsive Layout', () => {
    it('should apply responsive styling classes', () => {
      mockUseSong.mockReturnValue({
        data: mockSong,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);

      render(
        <TestWrapper>
          <SongPage />
        </TestWrapper>
      );

      // Check that the main container has responsive max-width
      const mainContainer = screen.getByRole('heading', { level: 1 }).closest('[class*="MuiBox"]');
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe('URL Parameter Handling', () => {
    it('should call useSong with the correct ID from URL params', () => {
      mockUseSong.mockReturnValue({
        data: mockSong,
        isLoading: false,
        error: null,
        isError: false,
        isSuccess: true,
        refetch: vi.fn(),
      } as any);

      render(
        <TestWrapper route="/song/test-song-id">
          <SongPage />
        </TestWrapper>
      );

      expect(mockUseSong).toHaveBeenCalledWith('test-song-id');
    });
  });
});