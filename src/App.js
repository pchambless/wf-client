import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { themeOptions } from './theme'; // Import themeOptions
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './utils/externalStore';
import { GlobalProvider } from './context/GlobalContext';
import { ModalProvider } from './context/ModalContext';
import ErrorBoundary from './components/ErrorBoundary';
import Container from './pages/Container'; // Import Container
import Login from './pages/Login'; // Import Login
import Welcome from './pages/Welcome'; // Import Welcome
import { getVar } from './utils/externalStore'; // Import getVar

const theme = createTheme(themeOptions); // Create theme using themeOptions

const App = () => {
  console.log('App: Rendering');
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
                  <Route path="/welcome/*" element={<Welcome />} />
                  <Route path="*" element={<ProtectedRoute component={Container} />} />
                </Routes>
              </ErrorBoundary>
            </Router>
          </ThemeProvider>
        </ModalProvider>
      </GlobalProvider>
    </Provider>
  );
};

const ProtectedRoute = ({ component: Component }) => {
  const isAuthenticated = getVar(':isAuth');
  console.log('ProtectedRoute: isAuthenticated', isAuthenticated);

  if (isAuthenticated === '1') {
    console.log('ProtectedRoute: User is authenticated, rendering component');
    return <Component />;
  } else {
    console.log('ProtectedRoute: User is not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }
};

export default App;
