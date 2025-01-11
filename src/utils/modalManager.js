import { useState, useCallback, useMemo } from 'react';
import useLogger from '../hooks/useLogger';

const useModalManager = () => {
  const [modalState, setModalState] = useState({ isOpen: false, config: null });
  const logAndTime = useLogger('ModalManager');

  const mapping = useMemo(() => ({
    userAccts: {
      title: 'User Accounts',
      type: 'table',
      listEvent: 'userAccts',
      id: 'acct_id',
      varName: ':acctID',
      label: 'account_name',
      labelName: ':acctName'
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
      varName: ':ingrTypeID',
      label: 'name',
      labelName: ':ingrTypeName'
    },
    // Add other modal configurations here
  }), []);

  const openModal = useCallback((configKey, additionalProps = {}) => {
    logAndTime(`openModal called with: ${configKey}`);

    const config = mapping[configKey];
    if (!config) {
      logAndTime(`Error: No configuration found for ${configKey}`);
      return;
    }

    setModalState({ 
      isOpen: true, 
      config: { ...config, ...additionalProps } 
    });
    logAndTime(`Modal opened: ${config.title || configKey}`);
  }, [mapping, logAndTime]);

  const closeModal = useCallback(() => {
    logAndTime('Closing modal');
    setModalState({ isOpen: false, config: null });
  }, [logAndTime]);

  return {
    modalState,
    openModal,
    closeModal,
  };
};

export default useModalManager;
