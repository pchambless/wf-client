import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';
import { setVars, getVar } from '../utils/externalStore';
import CustomModal from '../components/modal/CustomModal';

const ModalContext = createContext();


export const ModalProvider = ({ children }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const mapping = useMemo(() => ({
    userAccts: {
      title: 'User Accounts',
      type: 'table',
      listEvent: 'userAccts',
      id: 'acctID',
      label: 'acctName',
      columnMapping: {
        acctID: { label: 'Account ID', visible: false },
        account_name: { label: 'Account Name', visible: true }
      },
      setVars: (acctID, acctName) => {
        setVars({ ':acctID': acctID, ':acctName': acctName });
      }
    },
    deleteConfirm: {
      title: 'Confirm Deletion',
      type: 'message',
      message: 'Are you sure you want to delete this item?',
    },
    selIngrTypes: {
      title: 'Ingredient Types',
      type: 'table',
      listEvent: 'ingrTypeList',
      id: 'id',
      label: 'name',
      columnMapping: {
        id: { label: 'ID', visible: false },
        name: { label: 'Name', visible: true },
        description: { label: 'Description', visible: true }
      },
      setVars: (id, name) => {
        setVars({ ':ingrTypeID': id, ':ingrTypeName': name });
      }
    }
  }), []);

  const closeModal = useCallback(() => {
    setModalIsOpen(false);
    setModalConfig({});
  }, []);

  const openModal = useCallback((modalType, additionalProps = {}) => {
    if (modalIsOpen) {
      closeModal(); // Close any existing modal before opening a new one
    }

    const config = mapping[modalType];
    if (config) {
      const userAuthenticated = getVar('isAuth') === '1';
      console.log('ModalContext: User authentication status:', userAuthenticated ? '1' : '0');

      if (userAuthenticated) {
        setModalConfig({ ...config, ...additionalProps });
        setModalIsOpen(true);
        console.log('ModalContext: Modal state set:', { ...config, ...additionalProps });
      } else {
        console.log('ModalContext: User not authenticated, modal not opened');
      }
    } else {
      console.error(`ModalContext: Unknown modal type: ${modalType}`);
    }
  }, [mapping, modalIsOpen, closeModal]);

  console.log('ModalProvider rendering', { modalIsOpen, modalConfig });
  return (
    <ModalContext.Provider value={{ modalIsOpen, modalConfig, openModal, closeModal }}>
      {children}
      <CustomModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        content={modalConfig}
      />
    </ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext);
