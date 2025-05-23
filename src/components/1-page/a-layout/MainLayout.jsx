import React, { Suspense } from 'react';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import AppBar from '@navigation/AppBar';
import { navigationConfig } from '@config/navigationConfig';
import Sidebar from '@navigation/bb-Sidebar';

const SIDEBAR_WIDTH = 240;

const MainLayout = () => {
  const location = useLocation();
  
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'relative',
      bgcolor: '#f5f5f5',
    }}>
      {/* App Bar - fixed at top */}
      <Box sx={{ width: '100%', height: '64px', zIndex: 1100 }}>
        <AppBar />
      </Box>
      
      {/* Content area with sidebar and main content */}
      <Box sx={{ 
        display: 'flex', 
        flexGrow: 1,
        height: 'calc(100vh - 64px)',
        overflow: 'hidden'
      }}>
        {/* Sidebar */}
        <Box sx={{ 
          width: SIDEBAR_WIDTH, 
          flexShrink: 0,
          height: '100%',
          overflow: 'auto',
          borderRight: '1px solid #e0e0e0',
          bgcolor: 'background.paper'
        }}>
          <Suspense fallback={<CircularProgress />}>
            {navigationConfig ? (
              <Sidebar 
                open={true}
                onClose={() => {}}
                navigation={navigationConfig}
                currentPath={location.pathname}
              />
            ) : (
              <Typography color="error">
                Navigation config is missing!
              </Typography>
            )}
          </Suspense>
        </Box>
        
        {/* Main content area */}
        <Box sx={{ 
          flexGrow: 1,
          height: '100%',
          overflow: 'auto',
          p: 3,
          bgcolor: '#ffffff',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
        }}>
          {/* The outlet for nested routes */}
          <Container maxWidth="xl">
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
