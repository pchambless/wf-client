import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItem,
  List
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import createLogger from '@utils/logger';
import accountStore from '@stores/accountStore';
import { ROUTES } from '@config/RouteConstants';

const log = createLogger('SidebarNavItem');

const SidebarNavItem = observer(({ item, onClose, level = 0 }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  // Check if current path matches this item or its children
  const isActive = pathname === item.path;
  const isActiveParent = item.path && pathname.startsWith(item.path + '/');
  
  // State for expanded/collapsed sections
  const [open, setOpen] = useState(isActiveParent || isActive);
  
  const handleClick = () => {
    if (item.children && item.children.length > 0) {
      // Toggle the dropdown if there are children
      setOpen(!open);
    } else if (item.path) {
      // Simple direct navigation to the path specified in config
      log.info(`Navigating to: ${item.path}`);
      navigate(item.path);
      
      // Close mobile sidebar if applicable
      if (onClose) onClose();
    }
  };
  
  return (
    <>
      <ListItem disablePadding disableGutters>
        <ListItemButton
          onClick={handleClick}
          sx={{
            py: 1,
            pl: level * 2 + 1,
            ...(isActive && {
              bgcolor: 'primary.lighter',
              color: 'primary.main',
              fontWeight: 'bold'
            }),
            ...((isActiveParent || open) && !isActive && {
              color: 'text.primary'
            })
          }}
        >
          {item.icon && (
            <ListItemIcon
              sx={{
                minWidth: 32,
                color: isActive ? 'primary.main' : 'inherit'
              }}
            >
              {item.icon}
            </ListItemIcon>
          )}
          
          <ListItemText 
            primary={item.title} 
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: isActive ? 'bold' : 'medium'
            }}
          />
          
          {item.children && item.children.length > 0 && (
            open ? <ExpandLessIcon /> : <ExpandMoreIcon />
          )}
        </ListItemButton>
      </ListItem>
      
      {item.children && item.children.length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child) => (
              <SidebarNavItem
                key={child.title}
                item={child}
                level={level + 1}
                onClose={onClose}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
});

export default SidebarNavItem;
