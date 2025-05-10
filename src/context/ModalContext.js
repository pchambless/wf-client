import React, { createContext, useState, useContext, useMemo, useCallback, useEffect, useRef } from 'react';
import { getVar } from '../utils/externalStoreDel';
import Modal from '../components/3-common/a-modal/Modal'; // Import the renamed Modal component

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [pendingModalType, setPendingModalType] = useState(null);
  const [pendingAdditionalProps, setPendingAdditionalProps] = useState({});
  const previousFocusRef = useRef(null);

  const mapping = useMemo(() => ({
    deleteConfirm: {
      title: 'Confirm Deletion',
      type: 'message',
      message: 'Are you sure you want to delete this item?'
    },
    textMessage: {
      title: 'Text Message',
      type: 'message',
      message: 'This is a text message modal.'
    },
    error: {
      title: 'Error',
      type: 'message',
      message: 'An error occurred.'
    }
  }), []);

  const closeModal = useCallback(() => {
    console.log('ModalContext: Closing modal');
    setModalIsOpen(false);
    setModalConfig({});
    setPendingModalType(null);
    setPendingAdditionalProps({});
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, []);

  const openModal = useCallback((modalType, additionalProps = {}) => {
    const userAuthenticated = getVar(':isAuth') === '1';
    console.log('ModalContext: Opening modal', { modalType, userAuthenticated, additionalProps });

    if (userAuthenticated) {
      previousFocusRef.current = document.activeElement;
      setPendingModalType(modalType);
      setPendingAdditionalProps(additionalProps);
    } else {
      console.log('ModalContext: User not authenticated, modal not opened');
    }
  }, []);

  useEffect(() => {
    if (pendingModalType) {
      console.log('ModalContext: Processing pending modal', { pendingModalType, pendingAdditionalProps });
      const config = mapping[pendingModalType];
      if (config) {
        const newConfig = { ...config, ...pendingAdditionalProps };
        setModalConfig(newConfig);
        console.log('ModalContext: Modal config set:', newConfig);
        setModalIsOpen(true);
      } else {
        console.error(`ModalContext: Unknown modal type: ${pendingModalType}`);
      }
      setPendingModalType(null);
      setPendingAdditionalProps({});
    }
  }, [pendingModalType, pendingAdditionalProps, mapping]);

  console.log('ModalProvider rendering', { modalIsOpen, modalConfig });

  const renderModal = () => {
    if (!modalIsOpen || !modalConfig.type) {
      console.log('ModalContext: No modal to render');
      return null;
    }

    console.log('ModalContext: Rendering modal of type:', modalConfig.type);

    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        content={modalConfig}
      />
    );
  };

  return (
    <ModalContext.Provider value={{ modalIsOpen, modalConfig, openModal, closeModal }}>
      {children}
      {renderModal()}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext);
