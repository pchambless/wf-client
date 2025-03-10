import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Select, MenuItem, Button, Box } from '@mui/material';
import { useGlobalContext } from '../../context/GlobalContext';
import { getVar } from '../../utils/externalStore'; // Import getVar
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import logo from '../../assets/wf-icon.png'; // Import the logo
import LogoutIcon from '@mui/icons-material/Logout'; // Import the logout icon
import { fetchAcctLists } from '../../utils/acctLists'; // Import fetchAcctLists
import { useEventTypeContext } from '../../context/EventTypeContext'; // Import useEventTypeContext

const PageHeader = () => {
  const { userAcctList, selectedAccount, setAccount, pageTitle, logout } = useGlobalContext();
  const { execEvent } = useEventTypeContext(); // Get execEvent from EventTypeContext
  const navigate = useNavigate(); // Initialize useNavigate

  const handleAccountChange = async (event) => {
    setAccount(event.target.value);
    await fetchAcctLists(execEvent); // Fetch and cache account-specific lists when account changes
    navigate('/welcome'); // Redirect to Welcome page
  };

  useEffect(() => {
    const defaultAccountID = getVar(':acctID'); // Retrieve the default account ID
    if (userAcctList.length > 0 && !selectedAccount) {
      setAccount(defaultAccountID || userAcctList[0].acctID); // Set default account if not already set
    }
  }, [userAcctList, selectedAccount, setAccount]);

  return (
    <AppBar position="static" sx={{ bgcolor: 'background.paper' }}> {/* Ensure the background color is correct */}
      <Toolbar>
        <img src={logo} alt="Whatsfresh Logo" style={{ marginRight: '16px', width: '40px', height: '40px' }} /> {/* Resize the logo */}
        <Typography variant="h3" sx={{ flexGrow: 1, color: '#cc0000' }}> {/* Set the text color to magenta */}
          {pageTitle}
        </Typography>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Select
            value={selectedAccount || ''}
            onChange={handleAccountChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Select Account' }}
            sx={{ marginRight: '16px' }} // Add some margin to the right
          >
            {userAcctList && userAcctList.map((account) => (
              <MenuItem key={account.acctID} value={account.acctID}>
                {account.acctName}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={logout}
          sx={{ color: 'white' }} // Ensure the text color is white
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default PageHeader;
