import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { themeOptions } from './theme'; // Import themeOptions
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './utils/externalStore';
import { GlobalProvider } from './context/GlobalContext';
import { EventTypeProvider } from './context/EventTypeContext';
import { ModalProvider } from './context/ModalContext';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login'; // Import Login
import Welcome from './pages/Welcome'; // Import Welcome
import Crud from './pages/Crud'; // Import IngrTypes
import { Container } from '@mui/material'; // Import Container

const theme = createTheme(themeOptions); // Create theme using themeOptions

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
                  <Container maxWidth="lg" sx={{ padding: '16px' }}> {/* Adjust padding as needed */}
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/welcome" element={<Welcome />} />
                      <Route path="/crud" element={<Crud />} />
                      <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                  </Container>
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
