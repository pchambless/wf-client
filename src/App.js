import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './utils/externalStore';
import ErrorBoundary from './components/ErrorBoundary';
import Modal from './components/modal/Modal';
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

// Import pages
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import ingredientRoutes from './pages/Ingredients/routes';
import productRoutes from './pages/Products/routes';
import { accountRoutes, defaultAccountRoute } from './pages/Account/routes';

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
              <BreadcrumbProvider> {/* Add BreadcrumbProvider here */}
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/welcome" element={<Welcome />} />
                  
                
                  {/* Add all the nested Account routes */}
                  {accountRoutes.map((route, index) => (
                    <Route 
                      key={`account-route-${index}`}
                      path={route.path}
                      element={<route.component />}
                    />
                  ))}
                  
                  {/* Add the default redirect */}
                  <Route
                    path="/account"
                    element={<Navigate to={defaultAccountRoute.redirect} replace />}
                    exact={defaultAccountRoute.exact}
                  />
                  
                  {/* Map through ingredient routes instead of trying to render as a component */}
                  {ingredientRoutes.map((route, index) => (
                    <Route 
                      key={`ingredient-route-${index}`}
                      path={route.path}
                      element={route.element}
                    />
                  ))}

                  {/* Map through product routes similar to ingredients */}
                  {productRoutes.map((route, index) => (
                    <Route 
                      key={`product-route-${index}`}
                      path={route.path}
                      element={route.element}
                    />
                  ))}

                  {/* Add simple redirect for the products base path */}
                  <Route
                    path="/products"
                    element={<Navigate to={productRoutes[0]?.path} replace />}
                    exact
                  />

                  {/* Make sure this is your LAST route */}
                  <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
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
