import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { themeOptions } from '../src/theme'; // Import themeOptions
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './utils/externalStore';
import { GlobalProvider } from './context/GlobalContext';
import { ModalProvider } from './context/ModalContext';
import ErrorBoundary from './components/ErrorBoundary';
import Container from './pages/Container'; // Import Container
import Login from './pages/Login'; // Import Login

const theme = createTheme(themeOptions); // Create theme using themeOptions

const App = () => {
  return (
    <Provider store={store}>
      <GlobalProvider>
          <ModalProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Router>
                <ErrorBoundary>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/container" element={<Container />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                  </Routes>
                </ErrorBoundary>
              </Router>
            </ThemeProvider>
          </ModalProvider>
      </GlobalProvider>
    </Provider>
  );
};

export default App;
