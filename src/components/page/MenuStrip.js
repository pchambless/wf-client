import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSessionStore } from '../../stores/sessionStore';
import createLogger from '../../utils/logger';

const log = createLogger('MenuStrip');

const MenuStrip = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticated, user } = useSessionStore();

  const handleMenuItemClick = (path) => {
    log.debug('Menu click', { 
      clickedPath: path,
      currentPath: location.pathname,
      authenticated,
      hasUser: !!user
    });

    if (!authenticated || !user) {
      log.warn('Not authenticated during navigation');
      return;
    }

    navigate(path);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Menu
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            color="inherit" 
            onClick={() => handleMenuItemClick('/welcome')}
          >
            Welcome
          </Button>
          <Button 
            color="inherit" 
            onClick={() => handleMenuItemClick('/ingredients')}
          >
            Ingredients
          </Button>
          <Button 
            color="inherit" 
            onClick={() => handleMenuItemClick('/products')}
          >
            Products
          </Button>
          <Button 
            color="inherit" 
            onClick={() => handleMenuItemClick('/account')}
          >
            Account
          </Button>
          {user?.roleId === 1 && (
            <Button 
              color="inherit" 
              onClick={() => handleMenuItemClick('/admin')}
            >
              Admin
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MenuStrip;
