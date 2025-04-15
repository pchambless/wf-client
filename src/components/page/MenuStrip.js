import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import createLogger from '../../utils/logger';
import { triggerAction } from '../../actions/actionStore';
import { NAVIGATION } from '../../actions/core/constants';

const MenuStrip = () => {
  const navigate = useNavigate();
  const log = createLogger('MenuStrip');

  const handleMenuItemClick = (path, label) => {
    const operationId = `navigation-${Date.now()}`;
    log.group(operationId, `Navigation: ${label}`);
    
    log.info('Menu navigation', { path, label });
    
    // Extract page name from path
    const pageName = path.split('/')[1] || 'welcome';
    
    // Dispatch page selection action
    triggerAction(NAVIGATION.PAGE_SELECT, {
      path,
      pageName,
      label,
      timestamp: Date.now()
    });
    
    // Use React Router navigation instead of direct URL change
    navigate(path);
    
    log.debug('Navigation complete');
    log.groupEnd(operationId);
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
            onClick={() => handleMenuItemClick('/welcome', 'Welcome')}
          >
            Welcome
          </Button>
          <Button 
            color="inherit" 
            onClick={() => handleMenuItemClick('/ingredients/types', 'Ingredients')}
          >
            Ingredients
          </Button>
          <Button 
            color="inherit" 
            onClick={() => handleMenuItemClick('/products', 'Products')}
          >
            Products
          </Button>
          <Button 
            color="inherit" 
            onClick={() => handleMenuItemClick('/account', 'Account')}
          >
            Account
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MenuStrip;
