import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Pause as PauseIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { ScrollConfig, Song } from '../types/api';
import ConfigModal from './ConfigModal';

interface ScrollControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  isActive: boolean;
  config: ScrollConfig;
  song?: Song;
  onPlay: () => void;
  onStop: () => void;
  onPause: () => void;
  onConfigUpdate: (config: Partial<ScrollConfig>) => void;
}

const ScrollControls: React.FC<ScrollControlsProps> = ({
  isPlaying,
  isPaused,
  isActive,
  config,
  song,
  onPlay,
  onStop,
  onPause,
  onConfigUpdate,
}) => {
  const [configModalOpen, setConfigModalOpen] = useState(false);

  const handleConfigOpen = () => {
    setConfigModalOpen(true);
  };

  const handleConfigClose = () => {
    setConfigModalOpen(false);
  };

  const handleConfigSave = (newConfig: Partial<ScrollConfig>) => {
    onConfigUpdate(newConfig);
  };

  return (
    <>
      <Box 
        sx={{ 
          p: 2, 
          backgroundColor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          {/* Play Button */}
          <Tooltip title={isPaused ? "Resume scrolling" : "Start scrolling"}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayIcon />}
              onClick={onPlay}
              disabled={isPlaying}
              sx={{ minWidth: 100 }}
            >
              {isPaused ? 'Resume' : 'Play'}
            </Button>
          </Tooltip>

          {/* Pause Button */}
          <Tooltip title="Pause scrolling">
            <Button
              variant="outlined"
              startIcon={<PauseIcon />}
              onClick={onPause}
              disabled={!isPlaying}
              sx={{ minWidth: 100 }}
            >
              Pause
            </Button>
          </Tooltip>

          {/* Stop Button */}
          <Tooltip title="Stop scrolling and return to top">
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<StopIcon />}
              onClick={onStop}
              disabled={!isActive}
              sx={{ minWidth: 100 }}
            >
              Stop
            </Button>
          </Tooltip>

          {/* Config Button */}
          <Tooltip title="Configure scroll settings">
            <IconButton
              color="default"
              onClick={handleConfigOpen}
              sx={{ ml: 1 }}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Status Display */}
        {(isPlaying || isPaused) && (
          <Box sx={{ mt: 1, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {isPlaying && 'Playing'}
              {isPaused && 'Paused'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Configuration Modal */}
      <ConfigModal
        open={configModalOpen}
        config={config}
        song={song}
        onClose={handleConfigClose}
        onSave={handleConfigSave}
      />
    </>
  );
};

export default ScrollControls;