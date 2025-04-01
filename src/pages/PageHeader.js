import React, { useMemo, useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Select, MenuItem, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getVar, setVars, clearAllVars, subscribe } from '../utils/externalStore';
import logo from '../assets/wf-icon.png';
import LogoutIcon from '@mui/icons-material/Logout';
import createLogger from '../utils/logger';

const PageHeader = () => {
  const navigate = useNavigate();
  const log = useMemo(() => createLogger('PageHeader'), []);
  
  // Memoize values to prevent re-renders
  const accountList = useMemo(() => {
    const list = getVar(':userAcctList') || [];
    log.debug('Account list loaded:', {
      count: list.length,
      accounts: list.map(a => ({ id: a.acctID, name: a.acctName }))
    });
    return list;
  }, [log]);
  const currentAccount = useMemo(() => getVar(':acctID'), []);
  
  // Subscribe to page title changes
  const [pageTitle, setPageTitle] = useState(getVar(':pageTitle') || 'What\'s Fresh');
  
  useEffect(() => {
    const unsubscribe = subscribe(':pageTitle', () => {
      setPageTitle(getVar(':pageTitle') || 'What\'s Fresh');
    });
    return () => unsubscribe();
  }, []);

  const handleAccountChange = (event) => {
    const newAccountId = event.target.value;
    log.debug('Switching account', { from: currentAccount, to: newAccountId });
    setVars({ ':acctID': newAccountId });
    navigate('/welcome', { replace: true });
  };
  
  const handleLogout = () => {
    log.debug('Logging out');
    clearAllVars();
    navigate('/login', { replace: true });
  };

  // Simplify the rendering condition
  const showAccountSelector = accountList?.length > 0;

  return (
    <AppBar position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
      <Toolbar>
        <img 
          src={logo} 
          alt="Whatsfresh Logo" 
          style={{ marginRight: '16px', width: '40px', height: '40px' }} 
        />
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ flexGrow: 1, color: '#cc0000' }}
        >
          {pageTitle}
        </Typography>
        
        {showAccountSelector && (
          <Select
            value={currentAccount || ''}
            onChange={handleAccountChange}
            size="small"
            sx={{ 
              mx: 2, 
              minWidth: 150,
              backgroundColor: 'white'
            }}
          >
            {accountList.map(account => (
              <MenuItem 
                key={account.acctID} 
                value={account.acctID}
              >
                {account.acctName}
              </MenuItem>
            ))}
          </Select>
        )}
        
        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          size="small"
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default PageHeader;
