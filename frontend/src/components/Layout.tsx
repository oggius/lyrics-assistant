import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import {
  Home as HomeIcon,
  Add as AddIcon,
  LibraryMusic as LibraryMusicIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const showBackButton = location.pathname !== '/';
  
  const handleNavigationChange = (_event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const getNavigationValue = () => {
    if (location.pathname === '/') return '/';
    if (location.pathname === '/add') return '/add';
    if (location.pathname.startsWith('/song/')) return '/';
    return '/';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top App Bar */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          {showBackButton && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleBackClick}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Lyrics Assistant
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container 
        component="main" 
        maxWidth="lg" 
        sx={{ 
          flex: 1, 
          py: 2,
          pb: 8, // Space for bottom navigation
        }}
      >
        <Outlet />
      </Container>

      {/* Bottom Navigation */}
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0,
          zIndex: 1000,
        }} 
        elevation={3}
      >
        <BottomNavigation
          value={getNavigationValue()}
          onChange={handleNavigationChange}
          showLabels
        >
          <BottomNavigationAction
            label="Songs"
            value="/"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            label="Add Song"
            value="/add"
            icon={<AddIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default Layout;