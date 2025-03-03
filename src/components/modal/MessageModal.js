import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useModalContext } from '../../context/ModalContext';
import useLogger from '../../hooks/useLogger';

const MessageModal = ({ isOpen: propIsOpen, onRequestClose: propOnRequestClose, title: propTitle, message: propMessage }) => {
  const log = useLogger('MessageModal');
  const { modalIsOpen: contextIsOpen, modalConfig, closeModal } = useModalContext();

  const isOpen = propIsOpen !== undefined ? propIsOpen : contextIsOpen;
  const onRequestClose = propOnRequestClose || closeModal;
  const title = propTitle || modalConfig.title;
  const message = propMessage || modalConfig.message;

  useEffect(() => {
    if (isOpen) {
      log.debug('Message modal opened', {
        usesPropIsOpen: propIsOpen !== undefined,
        usesPropTitle: propTitle !== undefined,
        hasContextConfig: !!modalConfig
      });
    }
  }, [isOpen, propIsOpen, propTitle, modalConfig, log]);

  const handleClose = () => {
    log.debug('Closing message modal', { 
      title,
      wasConfirmed: false 
    });
    onRequestClose();
  };

  const handleConfirm = () => {
    log.info('Message modal confirmed', { title });
    onRequestClose();
  };

  if (!isOpen || (modalConfig.type !== 'message' && !propIsOpen)) {
    return null;
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="message-dialog-title">
      <DialogTitle id="message-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        {modalConfig.showCancel && (
          <Button onClick={handleClose} color="secondary">
            {modalConfig.cancelText || 'Cancel'}
          </Button>
        )}
        <Button onClick={handleConfirm} color="primary">
          {modalConfig.confirmText || 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageModal;
