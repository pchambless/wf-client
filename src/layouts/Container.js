import React from 'react';
import { Container as MuiContainer, Box } from '@mui/material';
import PageHeader from '../pages/PageHeader';
import MenuStrip from '../components/page/MenuStrip';
import createLogger from '../utils/logger';

const log = createLogger('Container');

const Container = ({ children }) => {
  log.debug('Container rendering with page-based (non-tab) navigation structure');
  
  return (
    <MuiContainer 
      maxWidth="xl" 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        bgcolor: 'background.default', 
        padding: '0' 
      }}
    >
      <PageHeader />
      <MenuStrip />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column'
        }}
      >
        {children}
      </Box>
    </MuiContainer>
  );
};

export default Container;
