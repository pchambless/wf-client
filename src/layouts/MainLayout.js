import React from 'react';
import { Box, Container } from '@mui/material'; // Use Container directly from @mui/material
import PageHeader from '../pages/PageHeader';
import MenuStrip from '../components/page/MenuStrip';
import { BreadcrumbProvider } from '../contexts/BreadcrumbContext';
import createLogger from '../utils/logger';

const log = createLogger('MainLayout');

/**
 * MainLayout serves as a wrapper that provides consistent structure
 * for all pages in the master-detail pattern.
 */
const MainLayout = ({ children }) => {
  log.debug('Rendering MainLayout');
  
  return (
    <BreadcrumbProvider>
      <Container 
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
      </Container>
    </BreadcrumbProvider>
  );
};

// HOC function to wrap any page component with MainLayout
export const withMainLayout = (Component) => {
  // Create proper named component instead of an anonymous function
  const WrappedComponent = (props) => (
    <MainLayout>
      <Component {...props} />
    </MainLayout>
  );
  
  // Add display name for better debugging
  WrappedComponent.displayName = `withMainLayout(${Component.displayName || Component.name || 'Component'})`;
  
  return WrappedComponent;
};

export default MainLayout;
