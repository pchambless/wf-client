import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getVar } from '../../utils/externalStore';

const MenuStrip = () => {
  const navigate = useNavigate();
  const [ setAnchorEl] = useState(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Menu
        </Typography>
        <Button color="inherit" onClick={() => handleMenuItemClick('/dashboard')}>
          Dashboard
        </Button>
        <Button color="inherit" onClick={() => handleMenuItemClick('/ingredients')}>
          Ingredients
        </Button>
        <Button color="inherit" onClick={() => handleMenuItemClick('/products')}>
          Products
        </Button>
        <Button color="inherit" onClick={() => handleMenuItemClick('/accounts')}>
          Accounts
        </Button>
        {getVar(':roleID') === 1 && (
          <Button color="inherit" onClick={() => handleMenuItemClick('/admin')}>
            Admin
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default MenuStrip;
