import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Select, MenuItem, Button, Box } from '@mui/material';
import { useGlobalContext } from '../../context/GlobalContext';
import { getVar } from '../../utils/externalStore'; // Import getVar
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import logo from '../../assets/wf-icon.png'; // Import the logo
import LogoutIcon from '@mui/icons-material/Logout'; // Import the logout icon
import useLogger from '../../hooks/useLogger';

const PageHeader = () => {
  const log = useLogger('PageHeader');
  const { userAcctList, selectedAccount, setAccount, pageTitle, logout } = useGlobalContext();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleAccountChange = (event) => {
    const newAccount = event.target.value;
    log.info('Changing account', { 
      previousAccount: selectedAccount, 
      newAccount,
      availableAccounts: userAcctList.length 
    });
    setAccount(newAccount);
    navigate('/welcome'); // Redirect to Welcome page
  };

  const handleLogout = () => {
    log.info('User logging out');
    logout();
  };

  useEffect(() => {
    const defaultAccountID = getVar(':acctID'); // Retrieve the default account ID
    log.debug('Checking for default account', { 
      defaultAccountID, 
      hasAccounts: userAcctList.length > 0,
      currentAccount: selectedAccount 
    });

    if (userAcctList.length > 0 && !selectedAccount) {
      const accountToSet = defaultAccountID || userAcctList[0].acctID;
      log.info('Setting default account', { accountToSet });
      setAccount(accountToSet); // Set default account if not already set
    }
  }, [userAcctList, selectedAccount, setAccount, log]);

  return (
    <AppBar position="static" sx={{ bgcolor: 'background.paper' }}> {/* Ensure the background color is correct */}
      <Toolbar>
        <Box display="flex" alignItems="center" width="100%">
          <img src={logo} alt="Whatsfresh Logo" style={{ height: '40px', marginRight: '16px' }} /> {/* Resize the logo */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#cc0000' }}> {/* Set the text color to magenta */}
            {pageTitle}
          </Typography>
          <Select
            value={selectedAccount || ''}
            onChange={handleAccountChange}
            sx={{ minWidth: 200, mr: 2, backgroundColor: 'white' }}
          >
            {userAcctList.map((account) => (
              <MenuItem key={account.acctID} value={account.acctID}>
                {account.acctName}
              </MenuItem>
            ))}
          </Select>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default PageHeader;
