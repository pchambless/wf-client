import React, { useState, useEffect, useRef } from 'react';
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
  setCurrentAccount,
  setUserSession,
  initSessionStore,
  initConfigStore,
  initAccountStore,
  initFormStore
} from '../stores';

const log = createLogger('Login');

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState(false);
  const navigate = useNavigate();
  const initAttempted = useRef(false);

  // Initialize event types ONLY
  useEffect(() => {
    if (initAttempted.current) return;
    initAttempted.current = true;

    const initializeEventTypes = async () => {
      try {
        log('Initializing event types');
        const success = await initEventTypeService();
        
        if (!success) {
          log.error('Failed to initialize event types');
          setInitError(true);
        } else {
          log('Event types initialized successfully');
          // No need to load measurement list here - it will be loaded after login
        }
      } catch (error) {
        log.error('Error initializing event types:', error);
        setInitError(true);
      } finally {
        setLoading(false);
      }
    };

    initializeEventTypes();
  }, []);

  // Update the handleLogin function

  const handleLogin = async (e) => {
    e.preventDefault();
    log('Login attempt started');
    log(`Email: ${email}`);

    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      log('Setting variables...');
      setVars({ ':userEmail': email, ':enteredPassword': password });

      log('Sending login request...');
      const response = await execEvent('userLogin', { ':userEmail': email, ':enteredPassword': password });

      log('Received login response');

      let user;
      if (Array.isArray(response) && response.length > 0) {
        user = response[0];
      } else if (response && typeof response === 'object') {
        user = response;
      } else {
        throw new Error('Invalid login response format');
      }

      const { userID, lastName, firstName, roleID, userEmail, dfltAcctID } = user;
      
      // 1. Initialize user session
      setUserSession({
        userID,
        roleID,
        userEmail,
        lastName,
        firstName,
        isAuthenticated: true
      });

      // 2. Set variables for backward compatibility
      setVars({ 
        ':userID': userID, 
        ':roleID': roleID, 
        ':userEmail': userEmail,
        ':lastName': lastName, 
        ':firstName': firstName, 
        ':isAuth': "1" 
      });

      log('User session established');
      
      // 3. Initialize stores in sequence - using proper store initialization functions
      try {
        // Initialize session store (which loads the account list)
        log('Initializing session store');
        await initSessionStore();
        
        // Initialize config store
        log('Initializing config store');
        await initConfigStore();
        
        // Set current account and initialize account-specific data
        log(`Setting current account: ${dfltAcctID}`);
        setCurrentAccount(dfltAcctID);
        setVars({ ':acctID': dfltAcctID });
        
        // Initialize account store
        log('Starting account store initialization');
        const accountInitSuccess = await initAccountStore(dfltAcctID);
        log(`Account store initialization ${accountInitSuccess ? 'succeeded' : 'failed'}`);
        
        // Initialize form store with reference data
        log('Initializing form store with reference data');
        await initFormStore();
        
        log('All application data initialized successfully');
      } catch (initError) {
        log.error('Error during initialization:', initError);
      }

      // 4. Navigate to the welcome page
      log('Login successful, navigating to welcome page');
      navigate('/welcome');
    } catch (error) {
      // Handle login errors...
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
