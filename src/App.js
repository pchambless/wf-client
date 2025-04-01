import React, { useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { themeOptions } from './theme';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './utils/externalStore'; 
import ErrorBoundary from './components/ErrorBoundary';
import Modal from './components/modal/Modal';
import { useModalStore } from './stores/modalStore';
import { useSessionStore } from './stores/sessionStore';
import createLogger from './utils/logger';
import { ProtectedRoute } from './components/ProtectedRoute';

// Import pages
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import Ingredient from './pages/Ingredient';
import Product from './pages/Product';
import Account from './pages/Account';
import Admin from './pages/Admin';

const theme = createTheme(themeOptions);
const log = createLogger('App');

// Log at the top-level App mounting
const App = () => {
  useEffect(() => {
    log.debug('App component mounted');
  }, []);

  console.log('App: Rendering');
  
  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
          <ModalContainer />
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

// Log router location and authentication status inside AppContent
const AppContent = () => {
  const { authenticated } = useSessionStore();
  const location = useLocation();
  const log = createLogger('App');

  // Memoize the protectedElement function
  const protectedElement = React.useCallback((path, Component) => {
    log.debug('Creating protected route', { 
      path, 
      currentPath: location.pathname,
      component: Component.name 
    });
    
    return (
      <ProtectedRoute path={path}>
        <Component />
      </ProtectedRoute>
    );
  }, [location.pathname, log]);

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={authenticated ? <Navigate to="/welcome" replace /> : <Login />} 
      />
      <Route 
        path="/login" 
        element={authenticated ? <Navigate to="/welcome" replace /> : <Login />} 
      />

      {/* Protected routes */}
      <Route path="/welcome" element={protectedElement("/welcome", Welcome)} />
      <Route path="/ingredients" element={protectedElement("/ingredients", Ingredient)} />
      <Route path="/products" element={protectedElement("/products", Product)} />
      <Route path="/account" element={protectedElement("/account", Account)} />
      <Route path="/admin" element={protectedElement("/admin", Admin)} />

      {/* Catch-all with logging */}
      <Route 
        path="*" 
        element={
          (() => {
            log.debug('Catch-all route hit', {
              path: location.pathname,
              redirectTo: authenticated ? "/welcome" : "/login"
            });
            return <Navigate to={authenticated ? "/welcome" : "/login"} replace />;
          })()
        } 
      />
    </Routes>
  );
};

const ModalContainer = () => {
  const { isOpen, config, closeModal } = useModalStore();
  const modalLog = createLogger('ModalContainer');
  
  useEffect(() => {
    modalLog.debug('ModalContainer rendered', { isOpen, config });
  }, [isOpen, config, modalLog]);

  const modalProps = {
    isOpen: isOpen,
    onRequestClose: closeModal,
    content: isOpen ? {
      type: config.type || 'message',
      title: config.title || '',
      message: config.message || '',
      ...config
    } : null,
    onRowClick: config.onRowClick || undefined
  };

  return <Modal {...modalProps} />;
};


export default App;
