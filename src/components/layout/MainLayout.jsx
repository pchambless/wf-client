import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../navigation/Sidebar';
import AppBar from '../AppBar';
// Update this import
import Breadcrumbs from '../navigation/Breadcrumbs';

/**
 * MainLayout provides the application shell with sidebar, header, and content area
 * All routes that require the standard application layout should be nested under this component
 */
const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  const handleCloseSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };
  
  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      {/* Sidebar */}
      <Sidebar 
        open={sidebarOpen} 
        onClose={handleCloseSidebar} 
      />
      
      {/* Main content area */}
      <Box sx={{ 
        flexGrow: 1, 
        p: 0,
        ...(sidebarOpen && {
          marginLeft: { xs: 0, md: '0px' },
        }),
      }}>
        {/* App header */}
        <AppBar 
          sidebarOpen={sidebarOpen} 
          onToggleSidebar={handleToggleSidebar} 
        />
        
        {/* Replace BreadcrumbDisplay with the correct component */}
        <Breadcrumbs />
        
        {/* Page content - renders child routes */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            px: 1,  // Reduce horizontal padding to just 1 unit (8px)
            py: 1,   // Reduce vertical padding
            pt: 0    // Keep top padding at 0
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
