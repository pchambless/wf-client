import React, { createContext, useState, useContext, useCallback, useMemo, useEffect } from 'react';
import Table from '../components/Table';
import DynamicForm from '../components/DynamicForm';
import useLogger from '../hooks/useLogger';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalConfig, setModalConfig] = useState(null);
  const [isConfigReady, setIsConfigReady] = useState(false);
  const logAndTime = useLogger('ModalContext');

  const mapping = useMemo(() => ({
    userAccts: {
      title: 'User Accounts',
      type: 'table',
      listEvent: 'userAccts',
    },
    // Add other modal configurations here
  }), []);

  const openConfiguredModal = useCallback((configKey, additionalProps = {}) => {
    const config = mapping[configKey];
    if (!config) {
      logAndTime(`Error: No configuration found for ${configKey}`);
      return;
    }

    logAndTime(`Opening ${config.type} modal: ${config.title}`);
    logAndTime(`Modal config:`, { ...config, ...additionalProps });

    setIsModalOpen(true);
    setModalTitle(config.title);
    setModalConfig({ ...config, ...additionalProps });
  }, [logAndTime, mapping]);

  useEffect(() => {
    if (modalConfig) {
      setIsConfigReady(true);
    } else {
      setIsConfigReady(false);
    }
  }, [modalConfig]);
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalTitle('');
    setModalConfig(null);
    setIsConfigReady(false);
  }, []);

  const renderModalContent = useCallback(() => {
    if (!isConfigReady || !modalConfig) return null;

    switch (modalConfig.type) {
      case 'table':
        return (
          <Table 
            listEvent={modalConfig.listEvent} 
            onRowClick={modalConfig.onRowClick} 
          />
        );
      case 'form':
        return (
          <DynamicForm 
            formEvent={modalConfig.formEvent} 
            submitEvent={modalConfig.submitEvent} 
            onSubmit={modalConfig.onSubmit} 
          />
        );
      case 'message':
        return <div className="p-4">{modalConfig.message}</div>;
      default:
        return <div>Unsupported modal type</div>;
    }
  }, [isConfigReady, modalConfig]);

  const contextValue = useMemo(() => ({
    isModalOpen,
    modalTitle,
    modalConfig,
    isConfigReady,
    openConfiguredModal,
    closeModal,
    renderModalContent,
  }), [isModalOpen, modalTitle, modalConfig, isConfigReady, openConfiguredModal, closeModal, renderModalContent]);

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
