import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { themeOptions } from './theme'; // Import themeOptions
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './utils/externalStore';
import { GlobalProvider, useGlobalContext } from './context/GlobalContext';
import { EventTypeProvider } from './context/EventTypeContext';
import { ModalProvider } from './context/ModalContext';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login'; // Import Login
import Welcome from './pages/Welcome'; // Import Welcome
import Ingredient from './pages/Ingredient'; // Import Ingredients
import Product from './pages/Product'; // Import Products
import Account from './pages/Account'; // Import Accounts
import Admin from './pages/Admin'; // Import Admin
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { createLogger } from './utils/logger/LogService';

const log = createLogger('App');
const theme = createTheme(themeOptions); // Create theme using themeOptions

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useGlobalContext();
  log.debug('Checking protected route access', { isAuthenticated });

  if (!isAuthenticated) {
    log.info('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppContent = () => {
  const { isAuthenticated } = useGlobalContext();
  log.debug('Rendering AppContent', { isAuthenticated });

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/welcome" replace /> : <Login />
      } />

      {/* Root route redirect - handle both exact and wildcard paths */}
      <Route index element={
        isAuthenticated ? <Navigate to="/welcome" replace /> : <Navigate to="/login" replace />
      } />

      <Route path="/" element={
        isAuthenticated ? <Navigate to="/welcome" replace /> : <Navigate to="/login" replace />
      } />

      {/* Protected routes */}
      <Route path="/welcome" element={
        <ProtectedRoute>
          <Welcome />
        </ProtectedRoute>
      } />
      
      <Route path="/ingredient" element={
        <ProtectedRoute>
          <Ingredient />
        </ProtectedRoute>
      } />
      
      <Route path="/product" element={
        <ProtectedRoute>
          <Product />
        </ProtectedRoute>
      } />
      
      <Route path="/account" element={
        <ProtectedRoute>
          <Account />
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>
      } />

      {/* Catch all route */}
      <Route path="*" element={
        isAuthenticated ? <Navigate to="/welcome" replace /> : <Navigate to="/login" replace />
      } />
    </Routes>
  );
};

const App = () => {
  log.info('Initializing application');
  return (
    <Provider store={store}>
      <Router>
        <GlobalProvider>
          <EventTypeProvider>
            <ModalProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <ErrorBoundary>
                    <AppContent />
                  </ErrorBoundary>
                </LocalizationProvider>
              </ThemeProvider>
            </ModalProvider>
          </EventTypeProvider>
        </GlobalProvider>
      </Router>
    </Provider>
  );
};

export default App;
