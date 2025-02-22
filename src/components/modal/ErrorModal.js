import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const ErrorModal = ({ open, onClose, errorMessage }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        bgcolor="background.paper"
        p={4}
        borderRadius={2}
        boxShadow={3}
      >
        <Typography variant="h6" color="error">
          Error
        </Typography>
        <Typography variant="body1" mt={2}>
          {errorMessage}
        </Typography>
        <Button onClick={onClose} variant="contained" color="primary" sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ErrorModal;
