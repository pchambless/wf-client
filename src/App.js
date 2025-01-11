import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { EventTypeProvider } from './context/EventTypeContext';
import { PageProvider } from './context/PageContext';
import { SelectProvider } from './context/SelectContext';
import { DebugProvider } from './context/DebugContext';
import IngrTypes from './pages/ingredients/IngrTypes';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import './styles/modal.css';
import useModalManager from './utils/modalManager';
import Modal from './components/Modal';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  const { modalState, closeModal } = useModalManager();

  return (
    <DebugProvider>
      <UserProvider>
        <EventTypeProvider>
          <PageProvider>
            <SelectProvider>
              <Router>
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/ingredients" element={<IngrTypes />} />
                    <Route path="/login" element={<Login />} />
                  </Routes>
                </ErrorBoundary>
              </Router>
              <Modal
                isOpen={modalState.isOpen}
                onClose={closeModal}
                title={modalState.config?.title}
                content={modalState.config?.content}
                contentType={modalState.config?.type}
              />
            </SelectProvider>
          </PageProvider>
        </EventTypeProvider>
      </UserProvider>
    </DebugProvider>
  );
};

export default App;
