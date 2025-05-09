import React from 'react';
import { Box, Typography } from '@mui/material';
import logo from '@assets/wf-icon.png';

const SidebarHeader = () => {
  
  return (
    <Box sx={{ 
      p: 2, 
      display: 'flex', 
      alignItems: 'center', 
      borderBottom: '1px solid',
      borderColor: 'divider'
    }}>
      <img 
        src={logo} 
        alt="Whatsfresh Logo" 
        style={{ marginRight: '16px', width: '32px', height: '32px' }} 
      />
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#cc0000' }}>
        WhatsFresh
      </Typography>
    </Box>
  );
};

export default SidebarHeader;
