import React, { useMemo, useEffect, useCallback, useState } from 'react';
import { AppBar, Toolbar, Typography, Select, MenuItem, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getVar, setVars, clearAllVars, usePollVar, clearAccountData, triggerAction } from '../utils/externalStoreDel';
import logo from '../assets/wf-icon.png';
import LogoutIcon from '@mui/icons-material/Logout';
import createLogger from '../utils/logger';
import { initAccountStore } from '../stores';

const PageHeader = () => {
  const navigate = useNavigate();
  const log = useMemo(() => createLogger('PageHeader'), []);
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Use usePollVar with a default value and reasonable interval
  // This eliminates the need for manual polling and state management
  const pageTitle = usePollVar(':pageTitle', "What's Fresh", 1000);
  
  // Set document title when page title changes
  useEffect(() => {
    // Only update document title when pageTitle changes
    if (pageTitle) {
      document.title = `WhatsFresh - ${pageTitle}`;
      
      // For debugging, log when the title changes
      log.debug(`Document title updated: ${document.title}`);
    }
  }, [pageTitle, log]);

  // Use usePollVar for reactive data binding
  const accountList = usePollVar(':userAcctList', []);

  // Log only when the list changes
  useEffect(() => {
    if (accountList?.length > 0) {
      log.info('Account list loaded:', {
        count: accountList.length,
        accounts: accountList.map(a => ({ id: a.acctID, name: a.acctName }))
      });
    }
  }, [accountList, log]);

  const currentAccount = usePollVar(':acctID');

  const handleAccountChange = useCallback(async (event) => {
    const newAccountId = event.target.value;
    log.info('Switch account', { from: currentAccount, to: newAccountId });

    // Prevent repeated initialization by disabling UI temporarily
    setIsLoading(true);

    try {
      // 1. Clear any existing data for the old account
      // Use a special method that doesn't clear the account list itself
      clearAccountData(); // Create this function in externalStore.js
      
      // 2. Set the new account ID first
      setVars({ 
        ':acctID': newAccountId,
        ':pageTitle': 'What\'s Fresh'
      });
      
      log.info('Initializing data for new account');
      
      // 3. Use a debounced initialization with a loading indicator
      const success = await initAccountStore();
      
      if (!success) {
        throw new Error('Failed to initialize account data');
      }
      
      // 4. Force a refresh of data that depends on the account
      triggerAction('ACCOUNT_CHANGED', { accountId: newAccountId });
      
      log.info('Account switched successfully, navigating to welcome page');
      navigate('/welcome', { replace: true });
    } catch (error) {
      log.error('Error switching accounts:', error);
      // Revert to previous account if there's an error
      setVars({ ':acctID': currentAccount });
    } finally {
      setIsLoading(false);
    }
  }, [currentAccount, log, navigate]);

  const handleLogout = () => {
    log.info('Logging out');
    clearAllVars();
    navigate('/login', { replace: true });
  };

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
          {pageTitle || "What's Fresh"}
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
