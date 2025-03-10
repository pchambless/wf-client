import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import { useEventTypeContext } from '../context/EventTypeContext';
import { useAccountContext } from '../context/AccountContext';
import logo from '../assets/wf-icon.png';
import createLogger from '../utils/logger';
import { fetchEventList, fetchPageConfigs } from '../api/api';
import { setVars } from '../utils/externalStore';
import { fetchLoginLists, fetchAcctLists } from '../utils/acctLists';
import { Box, Button, Container, TextField, Typography, Avatar, CssBaseline, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const log = createLogger('Login');

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const { setEventTypes, setPageConfigs, setIsAuthenticated, setMeasList, setUserAcctList } = useGlobalContext();
  const { setAccount } = useAccountContext();
  const { execEvent } = useEventTypeContext();
  const navigate = useNavigate();
  const effectRan = useRef({ eventTypes: false, measList: false }); // Track if the effects have run

  useEffect(() => {
    if (effectRan.current.eventTypes) return; // Prevent running the effect again

    const loadEventTypes = async () => {
      log('Loading EventTypes');
      await fetchEventList(setEventTypes);
      log('Loaded EventTypes');
      effectRan.current.eventTypes = true; // Mark the effect as run
    };

    loadEventTypes();
  }, [setEventTypes]); // Only include setEventTypes as a dependency

  useEffect(() => {
    const loadMeasList = async () => {
      log('Fetching measList');
      const measListResult = await execEvent('measList');
      setMeasList(measListResult);
      log('Fetched measList');
      setLoading(false);
    };

    if (effectRan.current.eventTypes && !effectRan.current.measList) {
      if (execEvent) {
        loadMeasList();
        effectRan.current.measList = true; // Mark the effect as run
      } else {
        log('No event type found for measList');
      }
    }
  }, [execEvent, setMeasList]); // Only include execEvent and setMeasList as dependencies

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

      log('received request...');

      if (!Array.isArray(response) || response.length === 0) {
        log('Response validation failed');
        throw new Error('Login failed after response');
      }

      log('Extracting user from response...');
      const user = response[0];
      log('User:', user);

      const { userID, lastName, firstName, roleID, userEmail, dfltAcctID } = user;
      log('set constants from request...');

      setVars({ ':userID': userID, ':roleID': roleID, ':userEmail': userEmail });
      setVars({ ':acctID': dfltAcctID, ':lastName': lastName, ':firstName': firstName, ':isAuth': "1" });

      setAccount(dfltAcctID); // Set the selectedAccount state

      log('Loading pageConfigs');
      await fetchPageConfigs(setPageConfigs);
      log('Loaded pageConfigs');

      log('Fetching login-specific lists');
      const { userAcctList, measList } = await fetchLoginLists(execEvent);
      setUserAcctList(userAcctList); // Cache userAcctList
      setMeasList(measList); // Cache measList
      log('Fetched login-specific lists');

      log('Fetching account-specific lists');
      await fetchAcctLists(execEvent);
      log('Fetched account-specific lists');

      setIsAuthenticated(true); // Set isAuthenticated to true

      log('User logged in successfully');
      log('Navigating to /welcome');
      navigate('/welcome');
    } catch (error) {
      log(`Login failed at the end: ${error.message}`);
      alert(`Login failed. Please try again.`);
    }
  };

  if (loading) {
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
          <CircularProgress />
        </Box>
      </Container>
    );
  }

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
