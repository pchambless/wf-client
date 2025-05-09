import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router } from 'react-router-dom';  // Remove unused Route, Routes, Navigate
import { Provider } from 'react-redux';
import store from './utils/externalStore';
import ErrorBoundary from './components/ErrorBoundary';
import Modal from './components/3-common/a-modal/Modal';
import { useModalStore } from './stores/modalStore';
import createLogger, { configureLogger } from './utils/logger';
import { disableBrowserFetchLogs } from './utils/fetchLogHelper';
import { ActionHandlerProvider } from './actions/ActionHandlerContext';
import { initEventTypeService, isEventTypeServiceInitialized } from './stores/eventStore';
import { BreadcrumbProvider } from './contexts/BreadcrumbContext';
import { 
  CircularProgress, 
  Box,
  Typography 
} from '@mui/material';
import theme from './theme';

// Updated routes import
import AppRoutes from './routes'; // Import your new main routes component

const log = createLogger('App');

// Configure logger at application startup
configureLogger({
  // Add any custom configuration here
  showTimestamps: true,
  dedupeTimeWindow: 500
});

// Log at the top-level App mounting
const App = () => {
  const [eventTypesLoaded, setEventTypesLoaded] = useState(false);
  
  useEffect(() => {
    // Filter out noisy browser fetch logs
    disableBrowserFetchLogs();
    log.debug('App component mounted');
    
    // Initialize event types
    const loadEventTypes = async () => {
      try {
        // Check if already initialized
        if (isEventTypeServiceInitialized()) {
          log.info('Event types already loaded');
          setEventTypesLoaded(true);
          return;
        }
        
        log.info('Loading event types...');
        await initEventTypeService();
        log.info('Event types loaded successfully');
        setEventTypesLoaded(true);
      } catch (error) {
        log.error('Failed to load event types:', error);
        // After a delay, retry loading event types
        setTimeout(loadEventTypes, 2000);
      }
    };
    
    loadEventTypes();
  }, []);

  console.log('App: Rendering');
  
  // Show loading screen until event types are loaded
  if (!eventTypesLoaded) {
    return (
      <ThemeProvider theme={theme}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <CircularProgress />
          <Typography variant="h6">Loading application data...</Typography>
        </Box>
      </ThemeProvider>
    );
  }
  
  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ErrorBoundary>
            <ActionHandlerProvider options={{ executeHandlers: true, logOnly: false }}>
              <BreadcrumbProvider>
                {/* Replace all the Routes with your new AppRoutes component */}
                <AppRoutes />
                <ModalContainer />
              </BreadcrumbProvider>
            </ActionHandlerProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

const ModalContainer = () => {
  // Use modal store to get modal state
  const { isOpen, config, closeModal } = useModalStore();
  
  // Add safety check for undefined onRowClick
  const handleRowClick = config?.onRowClick || (() => {});
  
  // Build modal props
  const modalProps = {
    isOpen,  // Fix: simplified property assignment
    onRequestClose: closeModal,
    content: isOpen ? {
      type: config?.type || 'message',
      title: config?.title || '',
      message: config?.message || '',
      ...config
    } : null,
    onRowClick: handleRowClick
  };
  
  // Return modal component
  return <Modal {...modalProps} />;
};

export default App;
