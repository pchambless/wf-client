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

const theme = createTheme(themeOptions); // Create theme using themeOptions

const AppContent = () => {
  const { isAuthenticated } = useGlobalContext();

  return (
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
