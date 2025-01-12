import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { AccountProvider } from './context/AccountContext';
import { EventTypeProvider } from './context/EventTypeContext';
import { PageProvider } from './context/PageContext';
import { SelectProvider } from './context/SelectContext';
import { DebugProvider } from './context/DebugContext';
import IngrTypes from './pages/ingredients/IngrTypes';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import CustomModal from './components/CustomModal';
import PageHeader from './components/PageHeader';
import ErrorBoundary from './components/ErrorBoundary';
import './modal/modal.css';

const App = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', content: {} });

  const openModal = (config) => {
    setModalConfig(config);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <DebugProvider>
      <UserProvider>
        <AccountProvider>
          <EventTypeProvider>
            <PageProvider>
              <SelectProvider>
                <Router>
                  <ErrorBoundary>
                    <PageHeader openModal={openModal} />
                    <Routes>
                      <Route path="/" element={<Login />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/ingredients" element={<IngrTypes />} />
                      <Route path="/login" element={<Login />} />
                    </Routes>
                    <CustomModal
                      isOpen={modalIsOpen}
                      onRequestClose={closeModal}
                      title={modalConfig.title}
                      content={modalConfig.content}
                    />
                  </ErrorBoundary>
                </Router>
              </SelectProvider>
            </PageProvider>
          </EventTypeProvider>
        </AccountProvider>
      </UserProvider>
    </DebugProvider>
  );
};

export default App;
