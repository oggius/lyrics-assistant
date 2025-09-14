// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Song Entity
export interface Song {
  id: string;
  title: string;
  author?: string;
  lyrics: string;
  scrollStartDelay: number; // seconds
  scrollSpeed: number; // 1-10 range
  createdAt: string;
  updatedAt: string;
}

// Lyrics Search Types
export interface LyricsSearchRequest {
  title: string;
  author?: string;
}

export interface LyricsSearchResponse {
  lyrics: string;
  source?: string;
  confidence: number;
}

// Scroll Configuration
export interface ScrollConfig {
  startDelay: number; // seconds
  speed: number; // 1-10 range
  isActive: boolean;
  isPaused: boolean;
}

// Form Types
export interface CreateSongRequest {
  title: string;
  author?: string;
  lyrics: string;
  scrollStartDelay?: number;
  scrollSpeed?: number;
}

export interface UpdateSongRequest extends Partial<CreateSongRequest> {
  id: string;
}

// Error Types
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}