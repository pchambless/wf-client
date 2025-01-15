import React, { createContext, useState, useContext, useMemo, useCallback, useEffect, useRef } from 'react';
import { getVar } from '../utils/externalStore';
import TableModal from '../components/modal/TableModal';
import MessageModal from '../components/modal/MessageModal';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [pendingModalType, setPendingModalType] = useState(null);
  const [pendingAdditionalProps, setPendingAdditionalProps] = useState({});
  const previousFocusRef = useRef(null);

  const mapping = useMemo(() => ({
    userAccts: {
      title: 'Select Account',
      type: 'table',
      listEvent: 'userAccts',
      columns: ['acctID', 'acctName'],
      columnLabels: {
        acctID: 'Account ID',
        acctName: 'Account Name'
      },
      hiddenColumns: ['acctID'],
      setPrfxVars: {
        ':acctId': 'acctID',
        ':acctName': 'acctName'
      }
    },
    deleteConfirm: {
      title: 'Confirm Deletion',
      type: 'message',
      message: 'Are you sure you want to delete this item?'
    },
    textMessage: {
      title: 'Text Message',
      type: 'message',
      message: 'This is a text message modal.'
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

    const commonProps = {
      isOpen: modalIsOpen,
      onRequestClose: closeModal,
      onAfterOpen: () => {
        // Set focus to the first focusable element in the modal
        const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length) {
          focusableElements[0].focus();
        }
      },
      shouldFocusAfterRender: true,
      shouldReturnFocusAfterClose: true,
    };

    switch (modalConfig.type) {
      case 'table':
        return (
          <TableModal
            {...commonProps}
            title={modalConfig.title}
            content={modalConfig}
          />
        );
      case 'message':
        return (
          <MessageModal
            {...commonProps}
            title={modalConfig.title}
            message={modalConfig.message}
          />
        );
      default:
        console.log('ModalContext: Unknown modal type:', modalConfig.type);
        return null;
    }
  };

  return (
    <ModalContext.Provider value={{ modalIsOpen, modalConfig, openModal, closeModal }}>
      {children}
      {renderModal()}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext);
