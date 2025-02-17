import React from 'react';
import { Container as MuiContainer, Box } from '@mui/material'; // Import Material-UI components
import PageHeader from '../components/page/PageHeader';
import MenuStrip from '../components/page/MenuStrip'; // Import MenuStrip

const Container = ({ children }) => {
  return (
    <MuiContainer maxWidth="xl" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'lightGray', padding: '0 16px' }}>
      <PageHeader />
      <MenuStrip />
      <Box component="main" sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {children}
      </Box>
      {/* You can add a footer here if needed */}
    </MuiContainer>
  );
};

export default Container;
