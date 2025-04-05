import { setVars, getVar, subscribe } from '../utils/externalStore';
// Use a different logger name to avoid circular dependency
import createLogger from '../utils/logger';

const log = createLogger('ModalStore');

// Private state
let isOpen = false;
let currentConfig = {};
let previousElement = null;

// Store keys
const MODAL_IS_OPEN = ':modal.isOpen';
const MODAL_CONFIG = ':modal.config';

// Modal type definitions
const modalTypes = {
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
};

/**
 * Open a modal dialog
 * @param {string} modalType - Type of modal to open
 * @param {object} additionalProps - Extra properties to merge with default configuration
 */
export const openModal = (modalType, additionalProps = {}) => {
  // Save currently focused element
  try {
    previousElement = document.activeElement;
  } catch (e) {
    log.warn('Could not save focused element');
  }

  // Get base configuration for this modal type
  const baseConfig = modalTypes[modalType];
  if (!baseConfig) {
    log.error(`Unknown modal type: ${modalType}`);
    return;
  }

  // Merge base config with additional props
  const config = {
    ...baseConfig,
    ...additionalProps
  };

  log('Opening modal', { type: modalType, config });

  // Update state
  isOpen = true;
  currentConfig = config;

  // Update external store
  setVars({
    [MODAL_IS_OPEN]: true,
    [MODAL_CONFIG]: config
  });
};

/**
 * Close current modal dialog
 */
export const closeModal = () => {
  log('Closing modal');

  // Update state
  isOpen = false;
  currentConfig = {};

  // Update external store
  setVars({
    [MODAL_IS_OPEN]: false,
    [MODAL_CONFIG]: {}
  });

  // Restore focus to previous element
  if (previousElement) {
    try {
      previousElement.focus();
    } catch (e) {
      log.warn('Could not restore focus');
    }
    previousElement = null;
  }
};

/**
 * Show an error modal with message
 * @param {string} message - Error message to display
 * @param {string} title - Optional custom title
 */
export const showError = (message, title = 'Error') => {
  openModal('error', {
    title,
    message,
    isError: true
  });
};

/**
 * Show a confirmation dialog
 * @param {string} message - Confirmation message
 * @param {Function} onConfirm - Function to call when confirmed
 * @param {Function} onCancel - Function to call when cancelled
 * @param {object} options - Additional options
 */
export const showConfirmation = (message, onConfirm, onCancel, options = {}) => {
  openModal('deleteConfirm', {
    message,
    onConfirm,
    onCancel,
    ...options
  });
};

/**
 * Get current modal state
 * @returns {object} Modal state with isOpen and config properties
 */
export const getModalState = () => {
  return {
    isOpen,
    config: currentConfig
  };
};

/**
 * React hook for using the modal store in components
 * @returns {object} Modal state and methods
 */
export const useModalStore = () => {
  const { useState, useEffect } = require('react');

  // Initialize state from current values
  const [modalState, setModalState] = useState({
    isOpen,
    config: { ...currentConfig }
  });

  // Subscribe to changes
  useEffect(() => {
    const unsubscribe = subscribe(MODAL_IS_OPEN, (value) => {
      // Handle the subscription event
      console.log('Modal state changed:', value);

      const newIsOpen = getVar(MODAL_IS_OPEN) || false;
      const newConfig = getVar(MODAL_CONFIG) || {};

      // Only update if something changed
      if (newIsOpen !== modalState.isOpen || 
          JSON.stringify(newConfig) !== JSON.stringify(modalState.config)) {
        setModalState({
          isOpen: newIsOpen,
          config: newConfig
        });
      }
    });

    return unsubscribe;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isOpen: modalState.isOpen,
    config: modalState.config,
    openModal,
    closeModal,
    showError,
    showConfirmation
  };
};

// Initialize store
(() => {
  // Set initial values in external store if not already set
  if (getVar(MODAL_IS_OPEN) === undefined) {
    setVars({
      [MODAL_IS_OPEN]: false,
      [MODAL_CONFIG]: {}
    });
  }
})();
