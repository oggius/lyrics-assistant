import React, { useRef } from 'react';
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
import { useSong, useUpdateSong } from '../hooks/useApi';
import { useScrollService } from '../hooks/useScrollService';
import { ScrollControls } from '../components';
import { ScrollConfig } from '../types/api';

const SongPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: song, isLoading, error } = useSong(id!);
  const updateSongMutation = useUpdateSong();
  const lyricsRef = useRef<HTMLDivElement>(null);
  const lyricsContentRef = useRef<HTMLHRElement>(null);

  // Initialize scroll service with song's scroll configuration
  const {
    isPlaying,
    isPaused,
    isActive,
    config,
    play,
    stop,
    pause,
    updateConfig,
  } = useScrollService({
    startDelay: song?.scrollStartDelay ?? 0,
    speed: song?.scrollSpeed ?? 5,
  });

  // Handle configuration update with server persistence
  const handleConfigUpdate = async (newConfig: Partial<ScrollConfig>) => {
    if (!song) return;

    // Update local scroll service immediately for responsive UI
    updateConfig(newConfig);

    // Update song on server
    try {
      await updateSongMutation.mutateAsync({
        id: song.id,
        scrollStartDelay: newConfig.startDelay ?? config.startDelay,
        scrollSpeed: newConfig.speed ?? config.speed,
      });
    } catch (error) {
      console.error('Failed to save scroll configuration:', error);
      // Optionally show an error message to the user
    }
  };

  // Handle play with scroll to lyrics content (the divider before lyrics)
  const handlePlay = () => {
    // Use getElementById as primary method, fallback to ref
    const targetElement = document.getElementById('lyrics-start-divider') || lyricsContentRef.current;
    play(targetElement || undefined);
  };

  // Handle click on lyrics area to pause/resume
  const handleLyricsClick = () => {
    if (isPlaying) {
      pause();
    } else if (isPaused) {
      play();
    }
  };

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
      {/* Combined Song Header and Controls */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        {/* Song Information */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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

        {/* Scroll Controls */}
        <ScrollControls
          isPlaying={isPlaying}
          isPaused={isPaused}
          isActive={isActive}
          config={config}
          song={song}
          onPlay={handlePlay}
          onStop={stop}
          onPause={pause}
          onConfigUpdate={handleConfigUpdate}
        />
      </Paper>

      {/* Lyrics Content - Clickable to pause/resume */}
      <Paper
        ref={lyricsRef}
        elevation={1}
        onClick={handleLyricsClick}
        sx={{
          p: 3,
          backgroundColor: 'background.paper',
          cursor: (isPlaying || isPaused) ? 'pointer' : 'default',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: (isPlaying || isPaused) ? 'action.hover' : 'background.paper',
          },
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
          {(isPlaying || isPaused) && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ ml: 'auto', fontStyle: 'italic' }}
            >
              Click to {isPlaying ? 'pause' : 'resume'}
            </Typography>
          )}
        </Typography>

        <Divider ref={lyricsContentRef} id="lyrics-start-divider" sx={{ mb: 3 }} />

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
    </Box>
  );
};

export default SongPage;