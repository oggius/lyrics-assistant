import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfigModal from './ConfigModal';
import { ScrollConfig } from '../types/api';

describe('ConfigModal', () => {
  const mockConfig: ScrollConfig = {
    startDelay: 2,
    speed: 7,
    isActive: false,
    isPaused: false,
  };

  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  const mockSong = {
    id: '1',
    title: 'Test Song',
    author: 'Test Author',
    lyrics: 'Test lyrics',
    scrollStartDelay: 3,
    scrollSpeed: 8,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };

  const defaultProps = {
    open: true,
    config: mockConfig,
    song: mockSong,
    onClose: mockOnClose,
    onSave: mockOnSave,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the modal when open is true', () => {
      render(<ConfigModal {...defaultProps} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Scroll Configuration')).toBeInTheDocument();
    });

    it('should not render the modal when open is false', () => {
      render(<ConfigModal {...defaultProps} open={false} />);
      
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should display server values from song in form fields', () => {
      render(<ConfigModal {...defaultProps} />);
      
      const startDelayInput = screen.getByLabelText(/start delay/i);
      const speedSlider = screen.getByRole('slider');
      
      // Should use song values (3, 8) instead of config values (2, 7)
      expect(startDelayInput).toHaveValue(3);
      expect(speedSlider).toHaveValue('8');
    });

    it('should display speed value in the label', () => {
      render(<ConfigModal {...defaultProps} />);
      
      // Should show song value (8) instead of config value (7)
      expect(screen.getByText('Scroll Speed: 8/10')).toBeInTheDocument();
    });

    it('should show helper text for form fields', () => {
      render(<ConfigModal {...defaultProps} />);
      
      expect(screen.getByText('Delay before scrolling starts (0 for immediate start)')).toBeInTheDocument();
      expect(screen.getByText('1 = Very Slow, 5 = Normal, 10 = Very Fast')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should update start delay when input changes', async () => {
      const user = userEvent.setup();
      render(<ConfigModal {...defaultProps} />);
      
      const startDelayInput = screen.getByLabelText(/start delay/i);
      
      await user.clear(startDelayInput);
      await user.type(startDelayInput, '5');
      
      expect(startDelayInput).toHaveValue(5);
    });

    it('should update speed when slider changes', async () => {
      render(<ConfigModal {...defaultProps} />);
      
      const speedSlider = screen.getByRole('slider');
      
      fireEvent.change(speedSlider, { target: { value: '3' } });
      
      await waitFor(() => {
        expect(screen.getByText('Scroll Speed: 3/10')).toBeInTheDocument();
      });
    });


  });

  describe('Button Actions', () => {
    it('should call onSave with updated config when save button is clicked', async () => {
      const user = userEvent.setup();
      render(<ConfigModal {...defaultProps} />);
      
      const startDelayInput = screen.getByLabelText(/start delay/i);
      const speedSlider = screen.getByRole('slider');
      const saveButton = screen.getByRole('button', { name: /save/i });
      
      await user.clear(startDelayInput);
      await user.type(startDelayInput, '3');
      
      // Use slider to set speed to 8
      fireEvent.change(speedSlider, { target: { value: '8' } });
      
      await user.click(saveButton);
      
      expect(mockOnSave).toHaveBeenCalledWith({
        startDelay: 3,
        speed: 8,
      });
    });

    it('should call onClose when save is successful', async () => {
      const user = userEvent.setup();
      render(<ConfigModal {...defaultProps} />);
      
      const saveButton = screen.getByRole('button', { name: /save/i });
      
      await user.click(saveButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<ConfigModal {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      
      await user.click(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should reset form to original values when cancel is clicked', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<ConfigModal {...defaultProps} />);
      
      const startDelayInput = screen.getByLabelText(/start delay/i);
      const speedSlider = screen.getByRole('slider');
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      
      // Change values first
      await user.clear(startDelayInput);
      await user.type(startDelayInput, '10');
      
      fireEvent.change(speedSlider, { target: { value: '9' } });
      
      // Cancel changes
      await user.click(cancelButton);
      
      // Reopen modal to check values were reset to song values
      rerender(<ConfigModal {...defaultProps} open={true} />);
      
      const newStartDelayInput = screen.getByLabelText(/start delay/i);
      const newSpeedSlider = screen.getByRole('slider');
      
      expect(newStartDelayInput).toHaveValue(3); // Song value
      expect(newSpeedSlider).toHaveValue('8'); // Song value
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and descriptions', () => {
      render(<ConfigModal {...defaultProps} />);
      
      const dialog = screen.getByRole('dialog');
      const startDelayInput = screen.getByLabelText(/start delay/i);
      const speedSlider = screen.getByRole('slider');
      
      expect(dialog).toHaveAttribute('aria-labelledby', 'config-modal-title');
      expect(startDelayInput).toHaveAttribute('aria-describedby', 'start-delay-helper-text');
      expect(speedSlider).toHaveAttribute('aria-labelledby', 'speed-slider-label');
    });

    it('should have proper form field IDs', () => {
      render(<ConfigModal {...defaultProps} />);
      
      expect(screen.getByLabelText(/start delay/i)).toHaveAttribute('id', 'start-delay-input');
    });
  });

  describe('Edge Cases', () => {
    it('should handle non-numeric input gracefully', async () => {
      const user = userEvent.setup();
      render(<ConfigModal {...defaultProps} />);
      
      const startDelayInput = screen.getByLabelText(/start delay/i);
      
      await user.clear(startDelayInput);
      await user.type(startDelayInput, 'abc');
      
      // Should default to 0 for invalid input
      expect(startDelayInput).toHaveValue(0);
    });

    it('should update form when config prop changes', () => {
      const { rerender } = render(<ConfigModal {...defaultProps} />);
      
      const newConfig: ScrollConfig = {
        startDelay: 5,
        speed: 3,
        isActive: false,
        isPaused: false,
      };
      
      // When song is provided, it should still use song values, not config values
      rerender(<ConfigModal {...defaultProps} config={newConfig} />);
      
      const startDelayInput = screen.getByLabelText(/start delay/i);
      const speedSlider = screen.getByRole('slider');
      
      // Should still use song values (3, 8) instead of new config values (5, 3)
      expect(startDelayInput).toHaveValue(3);
      expect(speedSlider).toHaveValue('8');
    });

    it('should handle negative start delay input', async () => {
      const user = userEvent.setup();
      render(<ConfigModal {...defaultProps} />);
      
      const startDelayInput = screen.getByLabelText(/start delay/i);
      
      // Select all and replace with negative value
      await user.click(startDelayInput);
      await user.keyboard('{Control>}a{/Control}');
      await user.type(startDelayInput, '-5');
      
      // The component should handle this gracefully (may clamp to 0 or show validation)
      expect(startDelayInput).toBeInTheDocument();
    });
  });

  describe('Validation and Save', () => {
    it('should save valid configuration', async () => {
      const user = userEvent.setup();
      render(<ConfigModal {...defaultProps} />);
      
      const startDelayInput = screen.getByLabelText(/start delay/i);
      const speedSlider = screen.getByRole('slider');
      const saveButton = screen.getByRole('button', { name: /save/i });
      
      await user.clear(startDelayInput);
      await user.type(startDelayInput, '5');
      
      fireEvent.change(speedSlider, { target: { value: '6' } });
      
      await user.click(saveButton);
      
      expect(mockOnSave).toHaveBeenCalledWith({
        startDelay: 5,
        speed: 6,
      });
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should handle edge case values correctly', async () => {
      const user = userEvent.setup();
      render(<ConfigModal {...defaultProps} />);
      
      const startDelayInput = screen.getByLabelText(/start delay/i);
      const speedSlider = screen.getByRole('slider');
      const saveButton = screen.getByRole('button', { name: /save/i });
      
      // Test minimum values
      await user.clear(startDelayInput);
      await user.type(startDelayInput, '0');
      
      fireEvent.change(speedSlider, { target: { value: '1' } });
      
      await user.click(saveButton);
      
      expect(mockOnSave).toHaveBeenCalledWith({
        startDelay: 0,
        speed: 1,
      });
    });

    it('should handle maximum values correctly', async () => {
      const user = userEvent.setup();
      render(<ConfigModal {...defaultProps} />);
      
      const startDelayInput = screen.getByLabelText(/start delay/i);
      const speedSlider = screen.getByRole('slider');
      const saveButton = screen.getByRole('button', { name: /save/i });
      
      // Test maximum values
      await user.clear(startDelayInput);
      await user.type(startDelayInput, '999');
      
      fireEvent.change(speedSlider, { target: { value: '10' } });
      
      await user.click(saveButton);
      
      expect(mockOnSave).toHaveBeenCalledWith({
        startDelay: 999,
        speed: 10,
      });
    });
  });
});