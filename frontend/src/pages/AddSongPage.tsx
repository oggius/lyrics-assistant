import React from 'react';
import { Typography, Box } from '@mui/material';

const AddSongPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Add New Song
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This page will allow users to add new songs with lyrics search functionality.
        Implementation will be completed in task 12.
      </Typography>
    </Box>
  );
};

export default AddSongPage;