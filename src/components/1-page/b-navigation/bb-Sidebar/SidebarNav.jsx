import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon, 
  ListItemText, 
  Divider 
} from '@mui/material';

// Replace with valid Material UI icons
import CategoryIcon from '@mui/icons-material/Category';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import ScaleIcon from '@mui/icons-material/Scale';
import InventoryIcon from '@mui/icons-material/Inventory';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

import createLogger from '@utils/logger';

const log = createLogger('SidebarNav');

const SidebarNav = ({ onClose }) => {
  const navigate = useNavigate();
  
  // Improved navigation function that doesn't trigger unnecessary account changes
  const navigateTo = (path) => {
    // Simple debug logging
    log.debug(`Navigating to ${path}`);
    
    // Direct navigation without additional logic for MVP
    navigate(path);
    
    // Close sidebar on mobile if needed
    if (onClose) onClose();
  };

  return (
    <Box>
      {/* Business Definition Section */}
      <Typography 
        variant="subtitle2" 
        sx={{ 
          px: 2,
          mb: 1, 
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}
      >
        Define your Business
      </Typography>
      
      <List>
        {/* Ingredients Subsection */}
        <ListItem sx={{ pt: 1 }}>
          <ListItemText 
            primary="Ingredients" 
            primaryTypographyProps={{ 
              variant: 'subtitle2',
              color: 'text.secondary',
              fontWeight: 'medium'
            }} 
          />
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigateTo('/ingredients')}>
            <ListItemIcon><RestaurantMenuIcon /></ListItemIcon>
            <ListItemText primary="Ingredients" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigateTo('/ingredient-types')}>
            <ListItemIcon><CategoryIcon /></ListItemIcon>
            <ListItemText primary="Ingredient Types" />
          </ListItemButton>
        </ListItem>
        
        {/* Products Subsection */}
        <ListItem sx={{ pt: 1 }}>
          <ListItemText 
            primary="Products" 
            primaryTypographyProps={{ 
              variant: 'subtitle2',
              color: 'text.secondary',
              fontWeight: 'medium'
            }} 
          />
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigateTo('/products')}>
            <ListItemIcon><ShoppingBasketIcon /></ListItemIcon>
            <ListItemText primary="Products" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigateTo('/product-types')}>
            <ListItemIcon><RestaurantIcon /></ListItemIcon>
            <ListItemText primary="Product Types" />
          </ListItemButton>
        </ListItem>
        
        {/* Account data Entities Subsection */}
        <ListItem sx={{ pt: 1 }}>
          <ListItemText 
            primary="Account Tables"
            primaryTypographyProps={{ 
              variant: 'subtitle2',
              color: 'text.secondary',
              fontWeight: 'medium'
            }} 
          />
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigateTo('/brands')}>
            <ListItemIcon><StorefrontIcon /></ListItemIcon>
            <ListItemText primary="Brands" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigateTo('/vendors')}>
            <ListItemIcon><LocalShippingIcon /></ListItemIcon>
            <ListItemText primary="Vendors" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigateTo('/workers')}>
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="Workers" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigateTo('/measures')}>
            <ListItemIcon><ScaleIcon /></ListItemIcon>
            <ListItemText primary="Measures" />
          </ListItemButton>
        </ListItem>
      </List>
      
      {/* Add divider here */}
      <Divider sx={{ my: 2 }} />
      
      {/* Batches Section */}
      <Typography 
        variant="subtitle2" 
        sx={{ 
          px: 2,
          mb: 1, 
          fontWeight: 'bold',
          textTransform: 'uppercase'
        }}
      >
        Batches
      </Typography>
      
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigateTo('/batches')}>
            <ListItemIcon><InventoryIcon /></ListItemIcon>
            <ListItemText primary="Manage Batches" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default SidebarNav;
