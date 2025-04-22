import React, { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Alert, InputAdornment, IconButton 
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import createLogger from '../utils/logger';

const log = createLogger('GitHubSettings');

const GitHubSettings = ({ open, onClose }) => {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Load token from localStorage when dialog opens
  useEffect(() => {
    if (open) {
      const savedToken = localStorage.getItem('github_pat');
      if (savedToken) {
        setToken(savedToken);
      }
    }
  }, [open]);
  
  const handleSave = () => {
    try {
      if (!token.trim()) {
        setError('Token cannot be empty');
        return;
      }
      
      // Save token to localStorage
      localStorage.setItem('github_pat', token);
      log.info('GitHub token saved');
      setSuccess(true);
      setError(null);
      
      // Close dialog after a short delay
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError('Failed to save token: ' + err.message);
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>GitHub API Settings</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Settings saved successfully!</Alert>}
        
        <TextField
          label="GitHub Personal Access Token"
          fullWidth
          margin="normal"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          type={showToken ? 'text' : 'password'}
          helperText="Token needs 'repo' scope permissions"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle token visibility"
                  onClick={() => setShowToken(!showToken)}
                  edge="end"
                >
                  {showToken ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GitHubSettings;
