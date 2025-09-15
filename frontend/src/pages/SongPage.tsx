import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  Skeleton,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import {
  MusicNote as MusicNoteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useSong } from '../hooks/useApi';

const SongPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: song, isLoading, error } = useSong(id!);

  // Loading state
  if (isLoading) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
          <Skeleton variant="text" width="60%" height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="80%" height={20} />
        </Paper>
        <Paper elevation={1} sx={{ p: 3 }}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="text"
              width={`${Math.random() * 40 + 60}%`}
              height={28}
              sx={{ mb: 1 }}
            />
          ))}
        </Paper>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
        >
          {error.message || 'Failed to load song. Please try again.'}
        </Alert>
      </Box>
    );
  }

  // No song found
  if (!song) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Alert 
          severity="warning" 
          sx={{ mb: 2 }}
        >
          Song not found. Please check the URL or go back to the songs list.
        </Alert>
      </Box>
    );
  }

  // Format lyrics for display - preserve line breaks and handle empty lines
  const formatLyrics = (lyrics: string): string[] => {
    return lyrics
      .split('\n')
      .map(line => line.trim())
      .map(line => line === '' ? '\u00A0' : line); // Replace empty lines with non-breaking space
  };

  const formattedLyrics = formatLyrics(song.lyrics);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      {/* Song Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <MusicNoteIcon color="primary" sx={{ mt: 0.5 }} />
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                wordBreak: 'break-word',
                lineHeight: 1.2,
              }}
            >
              {song.title}
            </Typography>
            
            {song.author && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PersonIcon color="action" fontSize="small" />
                <Typography 
                  variant="h6" 
                  color="text.secondary"
                  sx={{ wordBreak: 'break-word' }}
                >
                  {song.author}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Song Metadata */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={`Scroll Delay: ${song.scrollStartDelay}s`}
            variant="outlined"
            size="small"
          />
          <Chip
            label={`Scroll Speed: ${song.scrollSpeed}/10`}
            variant="outlined"
            size="small"
          />
        </Box>
      </Paper>

      {/* Lyrics Content */}
      <Paper 
        elevation={1} 
        sx={{ 
          p: 3,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mb: 2,
          }}
        >
          <MusicNoteIcon fontSize="small" />
          Lyrics
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
        
        <Box
          sx={{
            fontFamily: 'monospace',
            fontSize: '1.1rem',
            lineHeight: 1.8,
            whiteSpace: 'pre-line',
            wordBreak: 'break-word',
            color: 'text.primary',
            '& > div': {
              minHeight: '1.8em', // Ensure consistent line height even for empty lines
            },
          }}
        >
          {formattedLyrics.map((line, index) => (
            <Box key={index} component="div">
              {line}
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Future: Scroll Controls will be added in task 10 */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Scroll controls will be available in the next update
        </Typography>
      </Box>
    </Box>
  );
};

export default SongPage;