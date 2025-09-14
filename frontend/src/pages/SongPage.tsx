import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box } from '@mui/material';

const SongPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Song Details
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This page will display lyrics for song ID: {id}
        Implementation will be completed in task 9.
      </Typography>
    </Box>
  );
};

export default SongPage;