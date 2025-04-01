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
  initSessionStore,
  initAccountStore,
  setUserSession
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
        log.info('Initializing event types');  // Changed from log() to log.info()
        const success = await initEventTypeService();
        
        if (!success) {
          log.error('Failed to initialize event types');
          setInitError(true);
        } else {
          log.info('Event types initialized successfully'); // Changed from log()
          log.debug('Event types initialized');
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
    log.info('Login attempt started'); // Changed from log()
    log.debug(`Email: ${email}`);     // Changed from log()

    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      log.debug('Setting variables...'); // Changed from log()
      setVars({ ':userEmail': email, ':enteredPassword': password });

      log.info('Sending login request...'); // Changed from log()
      const response = await execEvent('userLogin', { ':userEmail': email, ':enteredPassword': password });

      log.debug('Received login response'); // Changed from log()

      let user;
      if (Array.isArray(response) && response.length > 0) {
        user = response[0];
      } else if (response && typeof response === 'object') {
        user = response;
      } else {
        throw new Error('Invalid login response format');
      }

      const { userID, lastName, firstName, roleID, userEmail, dfltAcctID } = user;
      
      // Set session and account data
      setVars({ 
        ':userID': userID, 
        ':roleID': roleID, 
        ':userEmail': userEmail,
        ':lastName': lastName, 
        ':firstName': firstName, 
        ':isAuth': "1",
        ':acctID': dfltAcctID      // Set default account
      });

      // Get user's account list first
      log.debug('Loading user account list');
      const accounts = await execEvent('userAcctList');

      log.debug('Account list received:', {
        count: accounts.length,
        accounts: accounts.map(a => ({ id: a.acctID, name: a.acctName }))
      });

      if (!Array.isArray(accounts) || accounts.length === 0) {
        log.error('Invalid or empty account list received');
        throw new Error('No accounts available');
      }
      log.debug('Account data stored', {
        accountCount: accounts.length,
        defaultAccount: dfltAcctID
      });

      // 1. Initialize user session
      setUserSession({
        userID,
        roleID,
        userEmail,
        lastName,
        firstName,
        isAuthenticated: true
      });

      log('User session established');
      
      // 2. Initialize stores in sequence - using proper store initialization functions
      try {
        // Initialize session store first (which now includes measurement units)
        log('Initializing session store');
        await initSessionStore();
        
        // Set current account and initialize account-specific data
        log(`Setting current account: ${dfltAcctID}`);
        // setCurrentAccount(dfltAcctID);
        setVars({ ':acctID': dfltAcctID });
        
        // Initialize account store (now without measurement units)
        log('Starting account store initialization');
        const accountInitSuccess = await initAccountStore(dfltAcctID);
        log(`Account store initialization ${accountInitSuccess ? 'succeeded' : 'failed'}`);
        
        log('All application data initialized successfully');
      } catch (initError) {
        log.error('Error during initialization:', initError);
      }

      // 3. Navigate to the welcome page
      log.debug('Preparing to navigate', {
        isAuthenticated: user.isAuthenticated,
        hasNavigate: !!navigate,
        destination: '/welcome'
      });
      
      // Force state updates to complete before navigation
      await Promise.resolve();
      
      log('Login successful, navigating to welcome page');
      navigate('/welcome', { replace: true });
      
    } catch (error) {
      log.error('Login failed:', error);
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
