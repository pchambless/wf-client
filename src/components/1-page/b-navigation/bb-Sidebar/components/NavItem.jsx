import React from 'react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import createLogger from '@utils/logger';

const log = createLogger('NavItem');

const NavItem = ({ icon, label, path, onNavigate }) => {
  const handleClick = () => {
    log.debug(`Navigating to ${path}`);
    onNavigate(path);
  };

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
};

export default NavItem;
