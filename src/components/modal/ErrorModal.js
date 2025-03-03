import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import useLogger from '../../hooks/useLogger';

const ErrorModal = ({ open, onClose, errorMessage }) => {
  const log = useLogger('ErrorModal');

  useEffect(() => {
    if (open) {
      log.error('Error modal displayed', { 
        errorMessage,
        timestamp: new Date().toISOString()
      });
    }
  }, [open, errorMessage, log]);

  const handleClose = () => {
    log.debug('Error modal closed', { 
      errorMessage,
      timestamp: new Date().toISOString()
    });
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="error-dialog-title"
      PaperProps={{
        style: {
          borderLeft: '4px solid #f44336'
        }
      }}
    >
      <DialogTitle id="error-dialog-title" style={{ color: '#f44336' }}>
        Error
      </DialogTitle>
      <DialogContent>
        <Typography color="error">
          {errorMessage}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorModal;
