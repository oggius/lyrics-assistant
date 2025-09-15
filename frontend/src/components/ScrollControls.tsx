import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Slider,
  Typography,
  Grid,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Pause as PauseIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { ScrollConfig } from '../types/api';

interface ScrollControlsProps {
  isPlaying: boolean;
  isPaused: boolean;
  isActive: boolean;
  config: ScrollConfig;
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
  onPlay,
  onStop,
  onPause,
  onConfigUpdate,
}) => {
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [tempConfig, setTempConfig] = useState<Partial<ScrollConfig>>({});

  const handleConfigOpen = () => {
    setTempConfig({
      startDelay: config.startDelay,
      speed: config.speed,
    });
    setConfigDialogOpen(true);
  };

  const handleConfigSave = () => {
    onConfigUpdate(tempConfig);
    setConfigDialogOpen(false);
  };

  const handleConfigCancel = () => {
    setTempConfig({});
    setConfigDialogOpen(false);
  };

  return (
    <>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2, 
          position: 'sticky', 
          bottom: 16, 
          zIndex: 1000,
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
        <Box sx={{ mt: 1, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Delay: {config.startDelay}s | Speed: {config.speed}/10
            {isPlaying && ' | Playing'}
            {isPaused && ' | Paused'}
          </Typography>
        </Box>
      </Paper> 
     {/* Configuration Dialog */}
      <Dialog 
        open={configDialogOpen} 
        onClose={handleConfigCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Scroll Configuration</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Start Delay */}
            <Grid item xs={12}>
              <TextField
                label="Start Delay (seconds)"
                type="number"
                fullWidth
                value={tempConfig.startDelay ?? config.startDelay}
                onChange={(e) => setTempConfig(prev => ({
                  ...prev,
                  startDelay: Math.max(0, parseInt(e.target.value) || 0)
                }))}
                inputProps={{ min: 0, step: 1 }}
                helperText="Delay before scrolling starts (0 for immediate start)"
              />
            </Grid>

            {/* Scroll Speed */}
            <Grid item xs={12}>
              <Typography gutterBottom>
                Scroll Speed: {tempConfig.speed ?? config.speed}/10
              </Typography>
              <Slider
                value={tempConfig.speed ?? config.speed}
                onChange={(_, value) => setTempConfig(prev => ({
                  ...prev,
                  speed: value as number
                }))}
                min={1}
                max={10}
                step={1}
                marks
                valueLabelDisplay="auto"
                sx={{ mb: 2 }}
              />
              <Typography variant="caption" color="text.secondary">
                1 = Very Slow, 5 = Normal, 10 = Very Fast
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfigCancel}>Cancel</Button>
          <Button onClick={handleConfigSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ScrollControls;