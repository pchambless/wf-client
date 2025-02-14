import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import { useGlobalContext } from '../../context/GlobalContext';
import useLogger from '../../hooks/useLogger';

const MenuComponents = ({ anchorEl, menuId, handleMenuClose, handleNavigate }) => {
  const log = useLogger('MenuComponent');
  const { pageConfigs, updatePageTitle, setPageID } = useGlobalContext();
  log('Rendering MenuComponents');

  const handleMenuItemClick = (pageID) => {
    log(`Menu item clicked with pageID: ${pageID}`);
    const pageConfig = pageConfigs.find(config => config.pageID === pageID);
    if (pageConfig) {
      log(`Navigating to page with pageID: ${pageID}`);
      updatePageTitle(pageConfig.pageTitle);
      setPageID(pageID); // Set the pageID in the GlobalContext
      handleNavigate(`/page/${pageID}`, pageConfig);
    }
    handleMenuClose();
  };

  return (
    <>
      <Menu
        id="dashboard-menu"
        anchorEl={anchorEl}
        open={menuId === 'dashboard'}
        onClose={handleMenuClose}
      >
        {pageConfigs
          .filter(config => config.menu === 'dashboard')
          .map(config => (
            <MenuItem key={config.pageID} onClick={() => handleMenuItemClick(config.pageID)}>
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
            <MenuItem key={config.pageID} onClick={() => handleMenuItemClick(config.pageID)}>
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
            <MenuItem key={config.pageID} onClick={() => handleMenuItemClick(config.pageID)}>
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
            <MenuItem key={config.pageID} onClick={() => handleMenuItemClick(config.pageID)}>
              {config.pageTitle}
            </MenuItem>
          ))}
      </Menu>
    </>
  );
};

export default MenuComponents;
