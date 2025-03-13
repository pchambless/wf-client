import React, { useEffect } from 'react';
import { AppBar, Toolbar, Typography, Select, MenuItem, Button, Box, Breadcrumbs as MuiBreadcrumbs, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getVar } from '../../utils/externalStore';
import logo from '../../assets/wf-icon.png';
import LogoutIcon from '@mui/icons-material/Logout';
import { fetchAcctLists } from '../../utils/acctLists';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// Import from stores instead of context
import { 
  useAccountStore, 
  useSessionStore,
  usePageStore,
  execEvent 
} from '../../stores';

// Remove the unused log import and variable

const PageHeader = () => {
  // Use stores instead of context
  const { accountList, currentAccount, setCurrentAccount } = useAccountStore();
  const { logout } = useSessionStore();
  const { pageTitle, breadcrumbs } = usePageStore();
  
  const navigate = useNavigate();

  const handleAccountChange = async (event) => {
    const newAccountId = event.target.value;
    setCurrentAccount(newAccountId);
    await fetchAcctLists(execEvent); // Fetch and cache account-specific lists
    navigate('/welcome');
  };

  useEffect(() => {
    const defaultAccountID = getVar(':acctID');
    if (accountList.length > 0 && !currentAccount) {
      setCurrentAccount(defaultAccountID || accountList[0].acctID);
    }
  }, [accountList, currentAccount, setCurrentAccount]);

  return (
    <AppBar position="static" sx={{ bgcolor: 'background.paper' }}>
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
          
          <Select
            value={currentAccount || ''}
            onChange={handleAccountChange}
            displayEmpty
            size="small"
            inputProps={{ 'aria-label': 'Select Account' }}
            sx={{ mx: 2, minWidth: 150 }}
          >
            {accountList && accountList.map((account) => (
              <MenuItem key={account.acctID} value={account.acctID}>
                {account.acctName}
              </MenuItem>
            ))}
          </Select>
          
          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={logout}
            sx={{ color: 'white' }}
            size="small"
          >
            Logout
          </Button>
        </Box>
        
        {/* Bottom row with breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 1 && (
          <Box sx={{ pb: 1 }}>
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
              
              {breadcrumbs.slice(1, -1).map((crumb, index) => (
                <Link
                  key={index}
                  component={RouterLink}
                  to={crumb.path}
                  underline="hover"
                  color="inherit"
                  sx={{
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  {crumb.label}
                </Link>
              ))}
              
              {/* Current page (last breadcrumb) is not a link */}
              {breadcrumbs.length > 1 && (
                <Typography color="text.primary">
                  {breadcrumbs[breadcrumbs.length - 1].label}
                </Typography>
              )}
            </MuiBreadcrumbs>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default PageHeader;
