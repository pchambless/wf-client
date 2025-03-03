import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import { useEventTypeContext } from '../context/EventTypeContext';
import logo from '../assets/wf-icon.png';
import useLogger from '../hooks/useLogger';
import { login, fetchEventList, fetchPageConfigs } from '../api/api';
import { setVars } from '../utils/externalStore';
import { Box, Button, Container, TextField, Typography, Avatar, CssBaseline, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
  const log = useLogger('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setEventTypes, setPageConfigs, setUserAcctList, setAccount, setIsAuthenticated } = useGlobalContext();
  const { execEvent, eventTypeLookup } = useEventTypeContext();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const endTimer = log.startPerformanceTimer('loginProcess');
    log.info('Login attempt started', { email });

    if (!email || !password) {
      log.warn('Login attempt failed - missing credentials');
      alert('Please fill in all fields.');
      endTimer();
      return;
    }

    try {
      setLoading(true);
      log.debug('Sending login request...');
      const response = await login(email, password);

      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const { userID, roleID, acctID, userEmail } = response.data.user;

      // Set user variables
      log.debug('Setting user variables');
      setVars({ 
        ':userID': userID, 
        ':roleID': roleID, 
        ':userEmail': userEmail,
        ':acctID': acctID, 
        ':isAuth': "1" 
      });

      setAccount(acctID);

      // Load event types first
      log.info('Loading EventTypes');
      await fetchEventList(setEventTypes);
      log.info('Loaded EventTypes');

      // Load page configurations
      log.info('Loading page configurations');
      try {
        const configs = await fetchPageConfigs(setPageConfigs);
        if (!configs || configs.length === 0) {
          throw new Error('No page configurations received');
        }
        log.info('Page configurations loaded successfully', { 
          configCount: configs.length 
        });
      } catch (configError) {
        log.error('Failed to load page configurations', { 
          error: configError.message 
        });
        throw new Error('Failed to initialize application configuration');
      }

      // Fetch user account list
      log.debug('Fetching user account list');
      if (eventTypeLookup('userAcctList')) {
        try {
          const userAcctList = await execEvent('userAcctList');
          await setUserAcctList(userAcctList);
          log.debug('User account list fetched successfully', {
            accountCount: userAcctList.length
          });
        } catch (acctError) {
          log.error('Failed to fetch user account list', {
            error: acctError.message
          });
          // Don't throw here, as this is not critical for app function
        }
      } else {
        log.warn('userAcctList event type not found');
      }

      setIsAuthenticated(true);
      log.info('Login successful, navigating to welcome page');
      endTimer();
      navigate('/welcome');

    } catch (error) {
      log.error('Login process failed', {
        error: error.message,
        stack: error.stack
      });
      setLoading(false);
      alert(error.message || 'Login failed. Please try again.');
      endTimer();
    }
  };

  return (
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
        {loading ? (
          <CircularProgress />
        ) : (
          <>
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
          </>
        )}
      </Box>
    </Container>
  );
};

export default Login;
