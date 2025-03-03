import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import useLogger from '../../hooks/useLogger';
import { useAuthContext } from '../../context/AuthContext';

const Login = () => {
  const log = useLogger('Login');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthContext();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Component lifecycle logging
  useEffect(() => {
    log.debug('Login component mounted');
    return () => log.debug('Login component unmounting');
  }, [log]);

  // Check authentication status
  useEffect(() => {
    if (isAuthenticated) {
      log.info('User already authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, log]);

  const handleInputChange = (field, value) => {
    log.debug('Form field changed', {
      field,
      valueLength: value.length
    });

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(errors).length > 0) {
      log.warn('Form validation failed', { errors });
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endTimer = log.startPerformanceTimer('loginAttempt');
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError('Please fill in all required fields correctly');
      endTimer();
      return;
    }

    log.info('Login attempt started', {
      username: formData.username,
      timestamp: new Date().toISOString()
    });

    setLoading(true);
    setError(null);

    try {
      await login(formData);
      log.info('Login successful', {
        username: formData.username,
        timestamp: new Date().toISOString()
      });
      navigate('/dashboard');
      endTimer();
    } catch (err) {
      log.error('Login failed', {
        error: err.message,
        username: formData.username,
        timestamp: new Date().toISOString()
      });
      setError(err.message || 'Login failed. Please try again.');
      endTimer();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            disabled={loading}
            error={!!error}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            disabled={loading}
            error={!!error}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Login'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login; 
