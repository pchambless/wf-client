import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useModalStore } from '../../../stores/modalStore';

const MessageModal = () => {
  const { isOpen, config, closeModal } = useModalStore();

  const title = config.title;
  const message = config.message;

  if (!isOpen || config.type !== 'message') {
    return null;
  }

  return (
    <Dialog open={isOpen} onClose={closeModal} aria-labelledby="message-dialog-title">
      <DialogTitle id="message-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        {config.showCancel && (
          <Button onClick={closeModal} color="secondary">
            {config.cancelText || 'Cancel'}
          </Button>
        )}
        <Button onClick={closeModal} color="primary">
          {config.confirmText || 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageModal;
