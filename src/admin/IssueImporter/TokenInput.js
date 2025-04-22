import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const TokenInput = ({ show, token, setToken, onSave, showManageButton, onManageToken }) => {
  if (!show && !showManageButton) return null;
  
  if (show) {
    return (
      <Box sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          GitHub Personal Access Token
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <TextField
            label="PAT Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            size="small"
            type="password"
            fullWidth
            helperText="This token will be stored in your browser's local storage"
          />
          <Button 
            variant="contained" 
            onClick={onSave}
            disabled={!token}
          >
            Save Token
          </Button>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Create a token with 'repo' scope at https://github.com/settings/tokens
        </Typography>
      </Box>
    );
  }
  
  if (showManageButton) {
    return (
      <Box sx={{ mb: 2 }}>
        <Button 
          variant="text" 
          onClick={onManageToken}
          size="small"
        >
          Manage GitHub Token
        </Button>
      </Box>
    );
  }
  
  return null;
};

export default TokenInput;
