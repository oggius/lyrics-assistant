import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Slider,
  Typography,
  Button,
  Grid,
  Box,
  Alert,
} from '@mui/material';
import { ScrollConfig, Song } from '../types/api';

interface ConfigModalProps {
  open: boolean;
  config: ScrollConfig;
  song?: Song;
  onClose: () => void;
  onSave: (config: Partial<ScrollConfig>) => void;
}

interface FormData {
  startDelay: number;
  speed: number;
}

interface FormErrors {
  startDelay?: string;
  speed?: string;
}

const ConfigModal: React.FC<ConfigModalProps> = ({
  open,
  config,
  song,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<FormData>({
    startDelay: config.startDelay,
    speed: config.speed,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Update form data when modal opens, using server values from song if available
  useEffect(() => {
    if (open) {
      setFormData({
        startDelay: song?.scrollStartDelay ?? config.startDelay,
        speed: song?.scrollSpeed ?? config.speed,
      });
      setErrors({});
    }
  }, [open, config, song]);

  // Validation functions
  const validateStartDelay = (value: number): string | undefined => {
    if (isNaN(value) || !Number.isInteger(value) || value < 0) {
      return 'Start delay must be a non-negative integer (0 or greater)';
    }
    return undefined;
  };

  const validateSpeed = (value: number): string | undefined => {
    if (isNaN(value) || !Number.isInteger(value) || value < 1 || value > 10) {
      return 'Speed must be an integer between 1 and 10';
    }
    return undefined;
  };

  // Handle start delay change
  const handleStartDelayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const value = inputValue === '' ? 0 : parseInt(inputValue);
    
    // Allow empty input temporarily, but validate the parsed value
    const finalValue = isNaN(value) ? 0 : Math.max(0, value);
    
    setFormData(prev => ({ ...prev, startDelay: finalValue }));
    
    const error = validateStartDelay(finalValue);
    setErrors(prev => ({ ...prev, startDelay: error }));
  };

  // Handle speed change from slider
  const handleSpeedSliderChange = (_: Event, value: number | number[]) => {
    const speedValue = Array.isArray(value) ? value[0] : value;
    setFormData(prev => ({ ...prev, speed: speedValue }));
    
    const error = validateSpeed(speedValue);
    setErrors(prev => ({ ...prev, speed: error }));
  };



  // Reset to original values
  const handleCancel = () => {
    setFormData({
      startDelay: song?.scrollStartDelay ?? config.startDelay,
      speed: song?.scrollSpeed ?? config.speed,
    });
    setErrors({});
    onClose();
  };

  // Save configuration
  const handleSave = () => {
    // Validate all fields
    const startDelayError = validateStartDelay(formData.startDelay);
    const speedError = validateSpeed(formData.speed);
    
    const newErrors: FormErrors = {};
    if (startDelayError) newErrors.startDelay = startDelayError;
    if (speedError) newErrors.speed = speedError;
    
    setErrors(newErrors);
    
    // If no errors, save the configuration
    if (!startDelayError && !speedError) {
      onSave({
        startDelay: formData.startDelay,
        speed: formData.speed,
      });
      onClose();
    }
  };

  // Check if form has errors
  const hasErrors = Object.values(errors).some(error => error !== undefined);

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      aria-labelledby="config-modal-title"
    >
      <DialogTitle id="config-modal-title">
        Scroll Configuration
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {/* Start Delay Configuration */}
          <Grid item xs={12}>
            <TextField
              label="Start Delay (seconds)"
              type="number"
              fullWidth
              value={formData.startDelay}
              onChange={handleStartDelayChange}
              error={!!errors.startDelay}
              helperText={errors.startDelay || "Delay before scrolling starts (0 for immediate start)"}
              inputProps={{ 
                min: 0, 
                step: 1,
                'aria-describedby': 'start-delay-helper-text'
              }}
              id="start-delay-input"
            />
          </Grid>

          {/* Scroll Speed Configuration */}
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom id="speed-slider-label">
                Scroll Speed: {formData.speed}/10
              </Typography>
              <Slider
                value={formData.speed}
                onChange={handleSpeedSliderChange}
                min={1}
                max={10}
                step={1}
                marks={[
                  { value: 1, label: '1' },
                  { value: 2, label: '2' },
                  { value: 3, label: '3' },
                  { value: 4, label: '4' },
                  { value: 5, label: '5' },
                  { value: 6, label: '6' },
                  { value: 7, label: '7' },
                  { value: 8, label: '8' },
                  { value: 9, label: '9' },
                  { value: 10, label: '10' },
                ]}
                valueLabelDisplay="auto"
                aria-labelledby="speed-slider-label"
                sx={{ mb: 2 }}
              />
            </Box>
            
            <Typography variant="caption" color="text.secondary" id="speed-helper-text">
              1 = Very Slow, 5 = Normal, 10 = Very Fast
            </Typography>
          </Grid>

          {/* Error Alert */}
          {hasErrors && (
            <Grid item xs={12}>
              <Alert severity="error">
                Please fix the validation errors above before saving.
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={hasErrors}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfigModal;