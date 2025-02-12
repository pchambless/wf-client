import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { themeOptions } from '../src/theme'; // Import themeOptions
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './utils/externalStore';
import { DebugProvider } from './context/DebugContext';
import { GlobalProvider } from './context/GlobalContext';
import { ModalProvider } from './context/ModalContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ErrorBoundary from './components/ErrorBoundary';
import Container from './components/Container';

const theme = createTheme(themeOptions); // Create theme using themeOptions

const App = () => {
  return (
    <Provider store={store}>
      <GlobalProvider>
        <DebugProvider>
          <ModalProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Router>
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Container><Dashboard /></Container>} />
                    <Route path="/login" element={<Login />} />
                  </Routes>
                </ErrorBoundary>
              </Router>
            </ThemeProvider>
          </ModalProvider>
        </DebugProvider>
      </GlobalProvider>
    </Provider>
  );
};

export default App;
