import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ApiResponse, Song, LyricsSearchRequest, LyricsSearchResponse, CreateSongRequest, UpdateSongRequest, ApiError } from '../types/api';

// API Base URL - will be configured via environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: any) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      statusCode: error.response?.status || 500,
      error: error.response?.data?.error,
    };
    return Promise.reject(apiError);
  }
);

// Query Keys
export const queryKeys = {
  songs: ['songs'] as const,
  song: (id: string) => ['songs', id] as const,
  lyricsSearch: (params: LyricsSearchRequest) => ['lyrics', 'search', params] as const,
};

// API Functions
const api = {
  // Songs API
  getSongs: async (): Promise<Song[]> => {
    const response = await apiClient.get<ApiResponse<Song[]>>('/songs');
    return response.data.data || [];
  },

  getSong: async (id: string): Promise<Song> => {
    const response = await apiClient.get<ApiResponse<Song>>(`/songs/${id}`);
    if (!response.data.data) {
      throw new Error('Song not found');
    }
    return response.data.data;
  },

  createSong: async (song: CreateSongRequest): Promise<Song> => {
    const response = await apiClient.post<ApiResponse<Song>>('/songs', song);
    if (!response.data.data) {
      throw new Error('Failed to create song');
    }
    return response.data.data;
  },

  updateSong: async ({ id, ...song }: UpdateSongRequest): Promise<Song> => {
    const response = await apiClient.put<ApiResponse<Song>>(`/songs/${id}`, song);
    if (!response.data.data) {
      throw new Error('Failed to update song');
    }
    return response.data.data;
  },

  deleteSong: async (id: string): Promise<void> => {
    await apiClient.delete(`/songs/${id}`);
  },

  // Lyrics Search API
  searchLyrics: async (params: LyricsSearchRequest): Promise<LyricsSearchResponse> => {
    const response = await apiClient.post<ApiResponse<LyricsSearchResponse>>('/lyrics/search', params);
    if (!response.data.data) {
      throw new Error('Failed to search lyrics');
    }
    return response.data.data;
  },
};

// Custom Hooks
export const useSongs = () => {
  return useQuery({
    queryKey: queryKeys.songs,
    queryFn: api.getSongs,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSong = (id: string) => {
  return useQuery({
    queryKey: queryKeys.song(id),
    queryFn: () => api.getSong(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useCreateSong = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.createSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.songs });
    },
  });
};

export const useUpdateSong = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.updateSong,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.songs });
      queryClient.setQueryData(queryKeys.song(data.id), data);
    },
  });
};

export const useDeleteSong = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.deleteSong,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.songs });
    },
  });
};

export const useSearchLyrics = () => {
  return useMutation({
    mutationFn: api.searchLyrics,
  });
};