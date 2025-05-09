import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import NavItem from '@navigation/bb-Sidebar/components/NavItem';

const NavSubsection = ({ title, items, onNavigate }) => {
  return (
    <>
      <ListItem sx={{ pt: 1 }}>
        <ListItemText 
          primary={title}
          primaryTypographyProps={{ 
            variant: 'subtitle2',
            color: 'text.secondary',
            fontWeight: 'medium'
          }} 
        />
      </ListItem>
      
      {items.map((item, index) => (
        <NavItem
          key={`${title}-item-${index}`}
          icon={item.icon}
          label={item.label}
          path={item.path}
          onNavigate={onNavigate}
        />
      ))}
    </>
  );
};

export default NavSubsection;
