import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/wf-icon.png';
import createLogger from '../utils/logger';
import { setVars } from '../utils/externalStore';
import { Box, Button, Container, TextField, Typography, Avatar, CssBaseline, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// Import only what we need from stores
import { 
  execEvent,
  initEventTypeService,
  initAccountStore  // Add this import
} from '../stores';

const log = createLogger('Login');

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState(false);
  const navigate = useNavigate();

  // Single initialization useEffect
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize EventStore first
        const success = await initEventTypeService();
        if (!success) {
          throw new Error('Event type initialization failed');
        }
        
        setLoading(false);
      } catch (error) {
        log.error('Application initialization failed:', error);
        setInitError(true);
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    log.info('Login attempt started');

    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      log.debug('Setting variables...');
      setVars({ ':userEmail': email, ':enteredPassword': password });

      log.info('Sending login request...');
      const response = await execEvent('userLogin');

      let user;
      if (Array.isArray(response) && response.length > 0) {
        user = response[0];
      } else if (response && typeof response === 'object') {
        user = response;
      } else {
        throw new Error('Invalid login response format');
      }

      const { userID, lastName, firstName, roleID, userEmail, dfltAcctID } = user;
      
      // Set user data
      setVars({ 
        ':userID': userID, 
        ':roleID': roleID, 
        ':userEmail': userEmail,
        ':lastName': lastName, 
        ':firstName': firstName, 
        ':isAuth': "1",
        ':acctID': dfltAcctID,
        ':pageTitle': "WhatsFresh" // Set page title here
      });

      // Get user's account list
      log.debug('Loading user account list');
      const accounts = await execEvent('userAcctList');

      if (!Array.isArray(accounts) || accounts.length === 0) {
        log.error('Invalid or empty account list received');
        throw new Error('No accounts available');
      }

      setVars({ ':userAcctList': accounts });

      // Load all reference lists
      log.info('Loading reference data lists...');
      const listsLoaded = await initAccountStore();
      if (!listsLoaded) {
        log.warn('Some reference lists failed to load');
      }

      log.info('Login successful, navigating to welcome page');
      navigate('/welcome', { replace: true });
      
    } catch (error) {
      log.error('Login failed:', error);
      setVars({ ':isAuth': '0' });
    }
  };

  // Display screens for different states
  if (initError) {
    return (
      <Container component="main" maxWidth="xs">
        <Box sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Avatar sx={{ m: 1, bgcolor: 'error.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" color="error">
            Initialization Error
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
            Failed to initialize the application. Please check your connection and refresh the page.
          </Typography>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </Box>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container component="main" maxWidth="xs">
        <Box sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Initializing application...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    // Login form JSX stays the same...
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          sx={{
            backgroundColor: '#e6e6e6', // Very light gray background
            padding: 3,
            borderRadius: 2,
            boxShadow: 1,
            mt: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <img src={logo} alt="Whatsfresh Logo" className="w-12 h-12 mr-2" />
            <Typography variant="h6" sx={{ color: 'darkgreen', textAlign: 'center' }}>
              Whatsfresh Today?
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ backgroundColor: 'white' }} // White background for input fields
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ backgroundColor: 'white' }} // White background for input fields
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
