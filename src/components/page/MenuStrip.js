import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import createLogger from '../../utils/logger';

const MenuStrip = () => {
  const navigate = useNavigate();
  const log = createLogger('MenuStrip');

  const handleMenuItemClick = (path) => {
    log.debug('Menu click', { path });
    
    // Use React Router navigation instead of direct URL change
    // This preserves app state between pages
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MenuStrip;
