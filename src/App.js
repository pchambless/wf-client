import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './utils/externalStore';
import { UserProvider } from './context/UserContext'; 
import { EventTypeProvider } from './context/EventTypeContext';
import { PageProvider } from './context/PageContext';
import { DebugProvider } from './context/DebugContext';
import { GlobalProvider } from './context/GlobalContext';
import { IngredientsProvider } from './context/IngredientsContext';
import { ModalProvider } from './context/ModalContext'; 
import IngrTypes from './pages/ingredients/IngrTypes';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ErrorBoundary from './components/ErrorBoundary';
import Container from './components/Container';

const App = () => {
  return (
    <Provider store={store}>
      <EventTypeProvider>
        <UserProvider>
          <GlobalProvider>
            <DebugProvider>
              <PageProvider>
                <ModalProvider>
                  <IngredientsProvider>
                    <Router>
                      <ErrorBoundary>
                        <Routes>
                          <Route path="/" element={<Login />} />
                          <Route path="/dashboard" element={<Container><Dashboard /></Container>} />
                          <Route path="/ingredients" element={<Container><IngrTypes /></Container>} />
                          <Route path="/login" element={<Login />} />
                        </Routes>
                      </ErrorBoundary>
                    </Router>
                  </IngredientsProvider>
                </ModalProvider>
              </PageProvider>
            </DebugProvider>
          </GlobalProvider>
        </UserProvider>
      </EventTypeProvider>
    </Provider>
  );
};

export default App;
