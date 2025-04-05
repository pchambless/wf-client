import React, { useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { themeOptions } from './theme';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './utils/externalStore'; 
import ErrorBoundary from './components/ErrorBoundary';
import Modal from './components/modal/Modal';
import { useModalStore } from './stores/modalStore';
import createLogger from './utils/logger';

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

// Simplify route definitions - remove ProtectedRoute wrapper
const AppContent = () => {

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {/* Direct routes without protection for MVP */}
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/ingredients" element={<Ingredient />} />
      <Route path="/products" element={<Product />} />
      <Route path="/account" element={<Account />} />
      <Route path="/admin" element={<Admin />} />

      {/* Simple catch-all */}
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
};

const ModalContainer = () => {
  const { isOpen, config, closeModal } = useModalStore();
  const modalLog = createLogger('App.Modal');
  
  useEffect(() => {
    modalLog.debug(' - rendered', { isOpen, config });
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
