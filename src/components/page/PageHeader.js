import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Select, MenuItem, Button, Box, Breadcrumbs as MuiBreadcrumbs, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getVar, setVars } from '../../utils/externalStore';
import logo from '../../assets/wf-icon.png';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import createLogger from '../../utils/logger';

// Import from stores
import { 
  useAccountStore, 
  useSessionStore,
  usePageStore,
  initAccountStore
} from '../../stores';

const log = createLogger('PageHeader');

const PageHeader = () => {
  const navigate = useNavigate();
  
  // Use hooks from stores
  const { currentAccount, setCurrentAccount } = useAccountStore();
  const { user, accountList, endUserSession } = useSessionStore();
  const { pageTitle, breadcrumbs } = usePageStore();
  
  // Debug logging
  useEffect(() => {
    log('PageHeader rendering with:', { 
      currentAccount, 
      accountList: accountList || [],
      accountCount: accountList?.length || 0,
      user
    });
  }, [currentAccount, accountList, user]);
  
  // Add an explicit logging effect for the account list
  useEffect(() => {
    console.log('DEBUGGING PageHeader - accountList changed:', {
      accountList,
      length: accountList?.length,
      isArray: Array.isArray(accountList),
      firstItem: accountList?.[0]
    });
    
    console.log('DEBUGGING PageHeader - currentAccount:', currentAccount);
  }, [accountList, currentAccount]);

  // Add this useEffect in PageHeader.js
  useEffect(() => {
    log('Breadcrumbs state:', {
      breadcrumbs,
      exists: !!breadcrumbs,
      length: breadcrumbs?.length || 0,
      condition: breadcrumbs && breadcrumbs.length > 1,
      sample: breadcrumbs?.[0]
    });
  }, [breadcrumbs]);
  
  // Handle account switching
  const handleAccountChange = async (event) => {
    const newAccountId = parseInt(event.target.value, 10);
    log(`Switching to account: ${newAccountId}`);
    
    try {
      // Update the current account in the store
      setCurrentAccount(newAccountId);
      
      // Update the external store variable
      setVars({ ':acctID': newAccountId });
      
      // Initialize data for the new account
      await initAccountStore(newAccountId);
      
      log(`Successfully switched to account: ${newAccountId}`);
      navigate('/welcome');
    } catch (error) {
      log.error(`Error switching to account ${newAccountId}:`, error);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    log('Logging out user');
    endUserSession();
    navigate('/login');
  };

  // Initialize account if needed
  useEffect(() => {
    // If we have accounts but no current account set, initialize with default
    if (accountList.length > 0 && !currentAccount) {
      const defaultAccountID = getVar(':acctID');
      const accountToUse = defaultAccountID || accountList[0].acctID;
      
      log(`Setting initial account: ${accountToUse}`);
      setCurrentAccount(accountToUse);
      setVars({ ':acctID': accountToUse });
    }
  }, [accountList, currentAccount, setCurrentAccount]);

  
  return (
    <AppBar position="static" sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
      <Toolbar sx={{ flexDirection: 'column', alignItems: 'stretch', py: 1 }}>
        {/* Top row with logo, title, account selector, and logout */}
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
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
          
          {/* Show account selector if there are any accounts (for debugging) */}
          {accountList && accountList.length > 0 && (
            <Box sx={{ mx: 2 }}>
              <Typography variant="caption" display="block" sx={{ fontSize: '10px', color: 'gray' }}>
                Account Selection ({accountList.length} accounts)
              </Typography>
              <Select
                value={currentAccount || ''}
                onChange={handleAccountChange}
                displayEmpty
                size="small"
                sx={{ minWidth: 150 }}
              >
                {/* Map accounts, handling different property name possibilities */}
                {accountList.map((account) => {
                  const id = account.acctID || account.accountID || account.id;
                  const name = account.acctName || account.accountName || account.name || `Account ${id}`;
                  return (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  );
                })}
              </Select>
            </Box>
          )}
          
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ color: 'white' }}
            size="small"
          >
            Logout
          </Button>
        </Box>
        
        {/* Bottom row with breadcrumbs - with improved debugging */}
        <Box sx={{ pb: 1 }}>
          {breadcrumbs && Array.isArray(breadcrumbs) && breadcrumbs.length > 0 ? (
            <MuiBreadcrumbs 
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              <Link
                component={RouterLink}
                to="/"
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
                underline="hover"
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Home
              </Link>
              
              {/* Map through all but last breadcrumb */}
              {breadcrumbs.slice(0, -1).map((crumb, index) => (
                <Link
                  key={`crumb-${index}-${crumb.path}`}
                  component={RouterLink}
                  to={crumb.path || '#'}
                  underline="hover"
                  color="inherit"
                  sx={{
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  {crumb.label || `Breadcrumb ${index + 1}`}
                </Link>
              ))}
              
              {/* Current page (last breadcrumb) */}
              {breadcrumbs.length > 0 && (
                <Typography color="text.primary">
                  {breadcrumbs[breadcrumbs.length - 1].label || 'Current Page'}
                </Typography>
              )}
            </MuiBreadcrumbs>
          ) : (
            // Debug placeholder when no breadcrumbs
            <Typography variant="caption" color="text.secondary">
              No breadcrumbs available
            </Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default PageHeader;
