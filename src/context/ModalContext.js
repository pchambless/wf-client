import React, { createContext, useContext } from 'react';
import { modalStore } from '../components/3-common/a-modal';
import createLogger from '@utils/logger';

const log = createLogger('ModalContext');

// Create context just for compatibility
const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  log.warn('ModalProvider is deprecated. Use <Modal/> component directly in App.js');
  
  // Forward all operations to modalStore
  const openModal = (modalType, additionalProps = {}) => {
    log.info('Forwarding to modalStore:', { modalType });
    modalStore.openModal(modalType, additionalProps);
  };

  const closeModal = () => {
    modalStore.closeModal();
  };

  // Provide backward compatibility
  return (
    <ModalContext.Provider value={{ 
      modalIsOpen: modalStore.isOpen, 
      modalConfig: modalStore.config,
      openModal, 
      closeModal 
    }}>
      {children}
      {/* No need to render Modal here as it should be in App.js */}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  log.warn('useModalContext is deprecated. Import useModal from components/3-common/a-modal');
  return useContext(ModalContext);
};
