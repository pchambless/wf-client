import React, { useMemo } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getVar } from '../../utils/externalStore';

const MenuStrip = () => {
  const navigate = useNavigate();

  const roleID = useMemo(() => getVar(':roleID'), []);

  const handleMenuItemClick = (path) => {
    navigate(path);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Menu
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button color="inherit" onClick={() => handleMenuItemClick('/dashboard')}>
              Dashboard
            </Button>
            <Button color="inherit" onClick={() => handleMenuItemClick('/ingredient')}>
              Ingredients
            </Button>
            <Button color="inherit" onClick={() => handleMenuItemClick('/product')}>
              Products
            </Button>
            <Button color="inherit" onClick={() => handleMenuItemClick('/account')}>
              Accounts
            </Button>
            {roleID === 1 && (
              <Button color="inherit" onClick={() => handleMenuItemClick('/admin')}>
                Admin
              </Button>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MenuStrip;
