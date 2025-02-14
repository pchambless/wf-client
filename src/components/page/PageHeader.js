import React, { useCallback, useEffect } from 'react';
import { setVars, getVar } from '../../utils/externalStore';
import { useGlobalContext } from '../../context/GlobalContext';
import createLogger from '../../utils/logger';
import logo from '../../assets/wf-icon.png';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, FormControl, InputLabel, Select as MuiSelect, MenuItem, CircularProgress } from '@mui/material';

const PageHeader = () => {
  const log = createLogger('PageHeader');
  const { pageTitle, getUserAcctList } = useGlobalContext();
  const userAcctList = getUserAcctList();
  const selectedAccount = getVar(':acctID') || '';

  useEffect(() => {
    log('PageHeader mounted');
  }, [log]);

  const handleAccountChange = useCallback((e) => {
    const value = e.target.value;
    setVars(':acctID', value);
  }, []);

  const handleLogout = useCallback(() => {
    log('Logging out');
    localStorage.clear();
    window.location.href = '/login';
  }, [log]);

  log('Rendering');

  if (!userAcctList || userAcctList.length === 0) {
    return <CircularProgress />;
  }

  return (
    <AppBar position="static" color="default" sx={{ bgcolor: 'lightGray', pt: 1 }}> {/* Add padding-top */}
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <IconButton edge="start" color="inherit" aria-label="logo">
            <img src={logo} alt="Whatsfresh Logo" style={{ width: '48px', height: '48px' }} />
          </IconButton>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {pageTitle}
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <FormControl fullWidth>
              <InputLabel id="select-account-label">Select Account</InputLabel>
              <MuiSelect
                labelId="select-account-label"
                id="select-account"
                value={selectedAccount}
                label="Select Account"
                onChange={handleAccountChange}
              >
                <MenuItem value="" disabled>Select Account</MenuItem>
                {userAcctList.map((account) => (
                  <MenuItem key={account.acctID} value={account.acctID}>
                    {account.acctName}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
          </Box>
          <Button
            onClick={handleLogout}
            sx={{
              backgroundColor: 'red',
              color: 'white',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: 'darkred',
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default React.memo(PageHeader);
