import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

console.log('App component loaded');

/**
 * The main component of the application. It sets up the context providers and routes for the application.
 * It also renders the Modal component based on the state provided by the useModalManager hook.
 *
 * @returns {JSX.Element} The JSX element representing the App component.
 */
const App = () => {
  console.log('App component rendered');
  const { modalState, closeModal } = useModalManager();

  return (
    <DebugProvider>
          <EventTypeProvider>
            <PageProvider>
              <SelectProvider>
                <Router>
                  <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/ingredients" element={<IngrTypes />} />
                    <Route path="/login" element={<Login />} />
                  </Routes>
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
    </DebugProvider> 
  );
};

export default App;
