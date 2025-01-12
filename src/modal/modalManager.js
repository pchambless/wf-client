import { useReducer, useCallback, useMemo } from 'react';
import useLogger from '../hooks/useLogger';

const initialState = { isOpen: false, config: null };

const modalReducer = (state, action) => {
  switch (action.type) {
    case 'OPEN_MODAL':
      return { isOpen: true, config: action.config };
    case 'CLOSE_MODAL':
      return { isOpen: false, config: null };
    default:
      return state;
  }
};

const useModalManager = () => {
  const [modalState, dispatch] = useReducer(modalReducer, initialState);
  const logAndTime = useLogger('ModalManager');

  const mapping = useMemo(() => ({
    userAccts: {
      title: 'User Accounts',
      type: 'table',
      listEvent: 'userAccts',
      id: 'acct_id',
      label: 'account_name',
      columnMapping: { acct_id: 'Account ID', account_name: 'Account Name' }
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
      columnMapping: { id: 'ID', name: 'Name' }
    },
  }), []);

  const openModal = useCallback((configKey, additionalProps = {}) => {
    console.log(`openModal called with: ${configKey}`);  // Add log
    logAndTime(`openModal called with: ${configKey}`);

    const config = mapping[configKey] || initialState.config;
    if (!config) {
      console.log(`Error: No configuration found for ${configKey}`);  // Add log
      logAndTime(`Error: No configuration found for ${configKey}`);
      return;
    }

    const finalConfig = { ...config, ...additionalProps };
    console.log(`Dispatching OPEN_MODAL with configuration: ${JSON.stringify(finalConfig)}`);  // Add log
    logAndTime(`Dispatching OPEN_MODAL with configuration: ${JSON.stringify(finalConfig)}`);

    dispatch({ type: 'OPEN_MODAL', config: finalConfig });

    console.log(`Modal state after dispatch: ${JSON.stringify({ isOpen: true, config: finalConfig })}`);  // Add log
    logAndTime(`Modal state after dispatch: ${JSON.stringify({ isOpen: true, config: finalConfig })}`);
  }, [mapping, logAndTime]);

  const closeModal = useCallback(() => {
    logAndTime('Dispatching CLOSE_MODAL');
    dispatch({ type: 'CLOSE_MODAL' });
  }, [logAndTime]);

  return {
    modalState,
    openModal,
    closeModal,
  };
};

export default useModalManager;
