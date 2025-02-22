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
import Ingredients from './pages/Ingredients'; // Import Ingredients
import Products from './pages/Products'; // Import Products
import Accounts from './pages/Accounts'; // Import Accounts
import Admin from './pages/Admin'; // Import Admin
import MenuStrip from './components/page/MenuStrip'; // Import MenuStrip
import { Container } from '@mui/material'; // Import Container

const theme = createTheme(themeOptions); // Create theme using themeOptions

const AppContent = () => {
  const { isAuthenticated } = useGlobalContext();

  return (
    <>
      {isAuthenticated && <MenuStrip />}
      <Container maxWidth="lg" sx={{ padding: '16px' }}> {/* Adjust padding as needed */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/products" element={<Products />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Container>
    </>
  );
};

const App = () => {
  console.log('App: Rendering');
  return (
    <Provider store={store}>
      <Router>
        <GlobalProvider>
          <EventTypeProvider>
            <ModalProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <ErrorBoundary>
                  <AppContent />
                </ErrorBoundary>
              </ThemeProvider>
            </ModalProvider>
          </EventTypeProvider>
        </GlobalProvider>
      </Router>
    </Provider>
  );
};

export default App;
