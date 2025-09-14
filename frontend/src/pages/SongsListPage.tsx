import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Button,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  MusicNote as MusicNoteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useSongs } from '../hooks/useApi';
import { Song } from '../types/api';

const SongsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: songs = [], isLoading, error, refetch } = useSongs();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter songs based on search query
  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) {
      return songs;
    }

    const query = searchQuery.toLowerCase().trim();
    return songs.filter(
      (song) =>
        song.title.toLowerCase().includes(query) ||
        (song.author && song.author.toLowerCase().includes(query))
    );
  }, [songs, searchQuery]);

  const handleSongClick = (songId: string) => {
    navigate(`/song/${songId}`);
  };

  const handleAddSongClick = () => {
    navigate('/add');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleRetry = () => {
    refetch();
  };

  // Loading state
  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="400px"
        gap={2}
      >
        <CircularProgress size={48} />
        <Typography variant="body1" color="text.secondary">
          Loading songs...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Songs Library
        </Typography>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              Retry
            </Button>
          }
        >
          Failed to load songs: {error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Songs Library
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddSongClick}
          size="large"
        >
          Add Song
        </Button>
      </Box>

      {/* Search Bar */}
      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search songs by title or author..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Results Summary */}
      {searchQuery && (
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary">
            {filteredSongs.length === 0
              ? 'No songs found'
              : `Found ${filteredSongs.length} song${filteredSongs.length === 1 ? '' : 's'}`}
            {searchQuery && ` for "${searchQuery}"`}
          </Typography>
        </Box>
      )}

      {/* Empty State */}
      {songs.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="300px"
          textAlign="center"
          gap={2}
        >
          <MusicNoteIcon sx={{ fontSize: 64, color: 'text.secondary' }} />
          <Typography variant="h6" color="text.secondary">
            No songs in your library yet
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Add your first song to get started with the Lyrics Assistant
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSongClick}
            size="large"
          >
            Add Your First Song
          </Button>
        </Box>
      ) : filteredSongs.length === 0 ? (
        // No search results
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="200px"
          textAlign="center"
          gap={2}
        >
          <SearchIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
          <Typography variant="h6" color="text.secondary">
            No songs match your search
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search terms or add a new song
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddSongClick}
            >
              Add Song
            </Button>
          </Stack>
        </Box>
      ) : (
        // Songs Grid
        <Grid container spacing={2}>
          {filteredSongs.map((song) => (
            <Grid item xs={12} sm={6} md={4} key={song.id}>
              <SongCard song={song} onClick={() => handleSongClick(song.id)} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

// Song Card Component
interface SongCardProps {
  song: Song;
  onClick: () => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getLyricsPreview = (lyrics: string, maxLength: number = 100) => {
    if (lyrics.length <= maxLength) return lyrics;
    return lyrics.substring(0, maxLength).trim() + '...';
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea 
        onClick={onClick}
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Song Title */}
          <Typography 
            variant="h6" 
            component="h2" 
            gutterBottom
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {song.title}
          </Typography>

          {/* Author */}
          {song.author && (
            <Typography 
              variant="subtitle2" 
              color="text.secondary" 
              gutterBottom
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              by {song.author}
            </Typography>
          )}

          {/* Lyrics Preview */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              flexGrow: 1,
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {getLyricsPreview(song.lyrics)}
          </Typography>

          {/* Metadata */}
          <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
            <Chip 
              label={`Speed: ${song.scrollSpeed}`} 
              size="small" 
              variant="outlined" 
            />
            {song.scrollStartDelay > 0 && (
              <Chip 
                label={`Delay: ${song.scrollStartDelay}s`} 
                size="small" 
                variant="outlined" 
              />
            )}
          </Box>

          {/* Date */}
          <Typography variant="caption" color="text.secondary">
            Added {formatDate(song.createdAt)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SongsListPage;