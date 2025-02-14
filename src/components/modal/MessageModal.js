import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useModalContext } from '../../context/ModalContext';

const MessageModal = ({ isOpen: propIsOpen, onRequestClose: propOnRequestClose, title: propTitle, message: propMessage }) => {
  const { modalIsOpen: contextIsOpen, modalConfig, closeModal } = useModalContext();

  const isOpen = propIsOpen !== undefined ? propIsOpen : contextIsOpen;
  const onRequestClose = propOnRequestClose || closeModal;
  const title = propTitle || modalConfig.title;
  const message = propMessage || modalConfig.message;

  if (!isOpen || (modalConfig.type !== 'message' && !propIsOpen)) {
    return null;
  }

  return (
    <Dialog open={isOpen} onClose={onRequestClose} aria-labelledby="message-dialog-title">
      <DialogTitle id="message-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        {modalConfig.showCancel && (
          <Button onClick={onRequestClose} color="secondary">
            {modalConfig.cancelText || 'Cancel'}
          </Button>
        )}
        <Button onClick={onRequestClose} color="primary">
          {modalConfig.confirmText || 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageModal;
