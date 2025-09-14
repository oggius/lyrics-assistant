import React from 'react';
import { Typography, Box } from '@mui/material';

const SongsListPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Songs Library
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This page will display the list of available songs.
        Implementation will be completed in task 8.
      </Typography>
    </Box>
  );
};

export default SongsListPage;