import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import useLogger from '../../hooks/useLogger';
import { getVar } from '../../utils/externalStore';
import { useGlobalContext } from '../../context/GlobalContext';
import { useNavigate } from 'react-router-dom';

const MenuStrip = () => {
  const log = useLogger('MenuStrip');
  const roleID = getVar(':roleID');
  log('roleID:', roleID);

  const { pageConfigs, updatePageTitle, setPageName } = useGlobalContext();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuId, setMenuId] = useState(null);

  const handleMenuOpen = (event, id) => {
    log('In MenuStrip');
    setAnchorEl(event.currentTarget);
    setMenuId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuId(null);
  };

  const handleMenuItemClick = (pageName) => {
    log(`Menu item clicked with pageName: ${pageName}`);
    const pageConfig = pageConfigs.find(config => config.pageName === pageName);
    if (pageConfig) {
      log(`Navigating to page with pageName: ${pageName}`);
      updatePageTitle(pageConfig.pageTitle);
      setPageName(pageConfig.pageName); // Set the pageName in the GlobalContext
      navigate(`/crud`, { state: { pageConfig } });
    }
    handleMenuClose();
  };

  log('Rendering MenuStrip');

  return (
    <Box display="flex" justifyContent="center" my={2} bgcolor="lightGray">
      <Button
        aria-controls="dashboard-menu"
        aria-haspopup="true"
        onClick={(event) => handleMenuOpen(event, 'dashboard')}
        sx={{ mx: 1 }}
      >
        Dashboard
      </Button>
      <Button
        aria-controls="ingredients-menu"
        aria-haspopup="true"
        onClick={(event) => handleMenuOpen(event, 'ingredients')}
        sx={{ mx: 1 }}
      >
        Ingredients
      </Button>
      <Button
        aria-controls="products-menu"
        aria-haspopup="true"
        onClick={(event) => handleMenuOpen(event, 'products')}
        sx={{ mx: 1 }}
      >
        Products
      </Button>
      {roleID === '1' && (
        <Button
          aria-controls="admin-menu"
          aria-haspopup="true"
          onClick={(event) => handleMenuOpen(event, 'admin')}
          sx={{ mx: 1 }}
        >
          Admin
        </Button>
      )}
      <Menu
        id="dashboard-menu"
        anchorEl={anchorEl}
        open={menuId === 'dashboard'}
        onClose={handleMenuClose}
      >
        {pageConfigs
          .filter(config => config.menu === 'dashboard')
          .map(config => (
            <MenuItem key={config.pageName} onClick={() => handleMenuItemClick(config.pageName)}>
              {config.pageTitle}
            </MenuItem>
          ))}
      </Menu>
      <Menu
        id="ingredients-menu"
        anchorEl={anchorEl}
        open={menuId === 'ingredients'}
        onClose={handleMenuClose}
      >
        {pageConfigs
          .filter(config => config.menu === 'ingredients')
          .map(config => (
            <MenuItem key={config.pageName} onClick={() => handleMenuItemClick(config.pageName)}>
              {config.pageTitle}
            </MenuItem>
          ))}
      </Menu>
      <Menu
        id="products-menu"
        anchorEl={anchorEl}
        open={menuId === 'products'}
        onClose={handleMenuClose}
      >
        {pageConfigs
          .filter(config => config.menu === 'products')
          .map(config => (
            <MenuItem key={config.pageName} onClick={() => handleMenuItemClick(config.pageName)}>
              {config.pageTitle}
            </MenuItem>
          ))}
      </Menu>
      <Menu
        id="admin-menu"
        anchorEl={anchorEl}
        open={menuId === 'admin'}
        onClose={handleMenuClose}
      >
        {pageConfigs
          .filter(config => config.menu === 'admin')
          .map(config => (
            <MenuItem key={config.pageName} onClick={() => handleMenuItemClick(config.pageName)}>
              {config.pageTitle}
            </MenuItem>
          ))}
      </Menu>
    </Box>
  );
};

export default MenuStrip;
