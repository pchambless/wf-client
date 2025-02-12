import React from 'react';
import { Container as MuiContainer, Box } from '@mui/material'; // Import Material-UI components
import PageHeader from '../components/page/PageHeader';

const Container = ({ children, openModal, acctName }) => {
  return (
    <MuiContainer maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'lightGray' }}>
      <PageHeader openModal={openModal} acctName={acctName} />
      <Box component="main" sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'row' }}>
        {children}
      </Box>
      {/* You can add a footer here if needed */}
    </MuiContainer>
  );
};

export default Container;
