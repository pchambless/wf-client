import React, { useState, createContext, useContext } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  CircularProgress,
  Box // Add Box import
} from '@mui/material';
import createLogger from '../utils/logger';

const log = createLogger('ModalStore');

// Add missing variables
let _previousElement = null;

// Add modalTypes definition
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

// Initialize as objects, will be assigned real functions during ModalProvider setup
let _showConfirmation = () => { 
  log.warn('Modal provider not initialized'); 
  return Promise.reject(new Error('Modal provider not initialized'));
};

let _showModal = () => { 
  log.warn('Modal provider not initialized'); 
  return Promise.reject(new Error('Modal provider not initialized'));
};

let _closeModal = () => { 
  log.warn('Modal provider not initialized');
};

export const ModalContext = createContext({
  showConfirmation: _showConfirmation,
  showModal: _showModal,
  closeModal: _closeModal
});

/**
 * Provides modal functionality to the application
 */
export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    open: false,
    title: '',
    content: null,
    onConfirm: null,
    onCancel: null,
    confirmText: 'OK',
    cancelText: 'Cancel',
    showConfirm: true,
    maxWidth: 'sm',
    loading: false
  });

  const showConfirmation = (content, onConfirm, onCancel, options = {}) => {
    log.debug('Showing confirmation modal', options);
    
    return new Promise((resolve) => {
      setModalState({
        open: true,
        title: options.title || 'Confirm',
        content,
        onConfirm: () => {
          if (onConfirm) onConfirm();
          resolve(true);
          closeModal();
        },
        onCancel: () => {
          if (onCancel) onCancel();
          resolve(false);
          closeModal();
        },
        confirmText: options.confirmText || 'OK',
        cancelText: options.cancelText || 'Cancel',
        showConfirm: options.showConfirm !== false,
        maxWidth: options.maxWidth || 'sm',
        loading: false
      });
    });
  };

  const showModal = (content, options = {}) => {
    log.debug('Showing modal', options);
    
    return new Promise((resolve) => {
      setModalState({
        open: true,
        title: options.title || 'Information',
        content,
        onConfirm: () => {
          resolve(true);
          closeModal();
        },
        onCancel: () => {
          resolve(false);
          closeModal();
        },
        confirmText: options.confirmText || 'OK',
        cancelText: options.cancelText || 'Close',
        showConfirm: options.showConfirm !== false,
        maxWidth: options.maxWidth || 'sm',
        loading: false
      });
    });
  };

  const closeModal = () => {
    log.debug('Closing modal');
    setModalState(prev => ({ ...prev, open: false }));
    
    // Restore focus to previous element
    if (_previousElement) {
      try {
        _previousElement.focus();
      } catch (e) {
        log.warn('Could not restore focus');
      }
      _previousElement = null;
    }
  };

  const setLoading = (loading) => {
    setModalState(prev => ({ ...prev, loading }));
  };

  // Assign the real functions to the exported ones
  _showConfirmation = showConfirmation;
  _showModal = showModal;
  _closeModal = closeModal;

  return (
    <>
      <ModalContext.Provider value={{ showConfirmation, showModal, closeModal, setLoading }}>
        {children}
      </ModalContext.Provider>
      
      <Dialog 
        open={modalState.open} 
        onClose={() => modalState.onCancel?.()} 
        maxWidth={modalState.maxWidth}
        fullWidth
      >
        {modalState.title && <DialogTitle>{modalState.title}</DialogTitle>}
        <DialogContent>
          {modalState.content}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => modalState.onCancel?.()} 
            color="primary"
            disabled={modalState.loading}
          >
            {modalState.cancelText}
          </Button>
          {modalState.showConfirm && (
            <Button 
              onClick={() => modalState.onConfirm?.()} 
              color="primary" 
              variant="contained"
              disabled={modalState.loading}
              startIcon={modalState.loading ? <CircularProgress size={16} /> : null}
            >
              {modalState.confirmText}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

// Export the hooks and functions
export const useModalStore = () => useContext(ModalContext);

// Export standalone functions that can be used outside of React components
export const showConfirmation = _showConfirmation;
export const showModal = _showModal;
export const closeModal = _closeModal;

// Add back the missing functions
export const openModal = (modalType, additionalProps = {}) => {
  // Save currently focused element
  try {
    _previousElement = document.activeElement;
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

  log.debug('Opening modal', { type: modalType, config });

  // Use the showModal function to display the content
  return _showModal(config.message || config.content, {
    title: config.title,
    confirmText: config.confirmText || 'OK',
    cancelText: config.cancelText || 'Cancel',
    maxWidth: config.maxWidth || 'sm'
  });
};

export const showError = (message, title = 'Error') => {
  log.debug('Showing error modal', { message, title });
  return _showModal(
    <Box sx={{ color: 'error.main' }}>
      {message}
    </Box>, 
    {
      title,
      confirmText: 'OK',
      showConfirm: true,
      maxWidth: 'sm'
    }
  );
};
