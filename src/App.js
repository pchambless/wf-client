import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { themeOptions } from './theme';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './utils/externalStore'; 
import ErrorBoundary from './components/ErrorBoundary';
import Modal from './components/modal/Modal'; // Update the path to your Modal component
import { useModalStore } from './stores/modalStore';
import { useSessionStore } from './stores/sessionStore';

// Import pages
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import Ingredient from './pages/Ingredient';
import Product from './pages/Product';
import Account from './pages/Account';
import Admin from './pages/Admin';

const theme = createTheme(themeOptions);

// Modal container component adapted for your existing Modal component
const ModalContainer = () => {
  const { isOpen, config, closeModal } = useModalStore();
  
  // Convert modalStore format to your Modal component's expected format
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

const AppContent = () => {
  // Use sessionStore hook instead of GlobalContext
  const { isAuthenticated } = useSessionStore();
  
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <>
                <Routes>
                  <Route path="/welcome" element={<Welcome />} />
                  <Route path="/ingredient" element={<Ingredient />} />
                  <Route path="/product" element={<Product />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<Navigate to="/welcome" />} />
                </Routes>
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      <ModalContainer />
    </>
  );
};

const App = () => {
  console.log('App: Rendering');
  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

export default App;
