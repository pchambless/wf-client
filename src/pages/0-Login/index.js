import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import LoginView from './View';
import { LoginPresenter } from './Presenter';
import createLogger from '../../utils/logger';

const log = createLogger('Login');

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const presenter = new LoginPresenter();

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      setError('');
      
      log.info('Login attempt with:', { email: values.email });
      
      // Call presenter with direct credentials
      const result = await presenter.handleLogin({
        email: values.email,
        password: values.password
      });
      
      if (result) {
        log.info('Login successful');
        setSuccess(true);
        
        // Delay navigation slightly to show success message
        setTimeout(() => {
          navigate('/dashboard'); // Navigate to dashboard instead of root
        }, 1000);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      log.error('Login failed:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  return (
    <>
      <LoginView 
        onLogin={handleLogin}
        loading={loading}
        error={error}
      />
      
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success">Login successful!</Alert>
      </Snackbar>
    </>
  );
};

export default Login;
