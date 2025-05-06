import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Collapse,
  Divider
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import LiquorIcon from '@mui/icons-material/Liquor';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import DashboardIcon from '@mui/icons-material/Dashboard';

const SidebarNav = ({ onNavigate }) => {
  const theme = useTheme();
  const location = useLocation();
  
  // State to track which sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    business: true,
    ingredients: true,
    products: false,
    batches: false
  });
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Helper to determine if a path is active
  const isActive = (path) => location.pathname.startsWith(path);
  
  return (
    <List 
      component="nav" 
      dense
      disablePadding
      sx={{ 
        px: 0.5,
        '& .MuiListItemText-primary': { 
          fontSize: '0.78rem',  // Smaller font
        },
        // Add this instead to make selected items bold:
        '& .Mui-selected .MuiListItemText-primary': {
          fontWeight: 'bold'
        },
        '& .MuiListItemIcon-root': {
          minWidth: '30px'  // Even smaller icon width
        },
        '& .MuiSvgIcon-root': {
          fontSize: '1.1rem' // Smaller icons
        },
        '& .MuiListItemButton-root': {
          py: 0.5, // Less vertical padding
          px: 1    // Less horizontal padding
        },
        '& .MuiCollapse-root .MuiListItemButton-root': {
          py: 0.25 // Even less padding for nested items
        }
      }}
    >
      {/* Dashboard Link */}
      <ListItemButton
        component={Link}
        to="/welcome"
        selected={isActive('/welcome')}
        onClick={onNavigate}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      
      <Divider sx={{ my: 0.5 }} />
      
      {/* Business Definition Section */}
      <ListItemButton 
        onClick={() => toggleSection('business')}
      >
        <ListItemIcon>
          <CategoryIcon />
        </ListItemIcon>
        <ListItemText primary="Define Your Business" />
        {expandedSections.business ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      
      <Collapse in={expandedSections.business} timeout="auto">
        <List component="div" disablePadding>
          {/* Ingredients Section - with pink theming */}
          <ListItemButton 
            sx={{ 
              pl: 2,
              bgcolor: expandedSections.ingredients ? 
                theme.palette.sections?.ingredients?.light || '#f8bbd0' : 'transparent',
              '&:hover': {
                bgcolor: theme.palette.sections?.ingredients?.main || '#f48fb1'
              },
              borderLeft: expandedSections.ingredients ? 
                `3px solid ${theme.palette.sections?.ingredients?.dark || '#ec407a'}` : 'none'
            }}
            onClick={() => toggleSection('ingredients')}
          >
            <ListItemIcon>
              <LiquorIcon />
            </ListItemIcon>
            <ListItemText primary="Ingredients" />
            {expandedSections.ingredients ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          
          <Collapse in={expandedSections.ingredients} timeout="auto">
            <List component="div" disablePadding sx={{ 
              bgcolor: theme.palette.sections?.ingredients?.light || '#f8bbd0',
              opacity: 0.8
            }}>
              <ListItemButton 
                component={Link} 
                to="/ingredients/types"
                selected={isActive('/ingredients/types')}
                onClick={onNavigate}
                sx={{ 
                  pl: 4,
                  borderLeft: isActive('/ingredients/types') ? 
                    `3px solid ${theme.palette.sections?.ingredients?.dark || '#ec407a'}` : 'none',
                  '&.Mui-selected': {
                    bgcolor: theme.palette.sections?.ingredients?.main || '#f48fb1',
                    '&:hover': {
                      bgcolor: theme.palette.sections?.ingredients?.main || '#f48fb1'
                    }
                  }
                }}
              >
                <ListItemText primary="Ingredient Types" />
              </ListItemButton>
              <ListItemButton 
                component={Link} 
                to="/ingredients"
                selected={isActive('/ingredients')}
                onClick={onNavigate}
                sx={{ 
                  pl: 4,
                  borderLeft: isActive('/ingredients') ? 
                    `3px solid ${theme.palette.sections?.ingredients?.dark || '#ec407a'}` : 'none',
                  '&.Mui-selected': {
                    bgcolor: theme.palette.sections?.ingredients?.main || '#f48fb1',
                    '&:hover': {
                      bgcolor: theme.palette.sections?.ingredients?.main || '#f48fb1'
                    }
                  }
                }}
              >
                <ListItemText primary="Ingredients" />
              </ListItemButton>
            </List>
          </Collapse>
          
          {/* Products Section - with blue theming */}
          <ListItemButton 
            sx={{ 
              pl: 2,
              bgcolor: expandedSections.products ? 
                theme.palette.sections?.products?.light || '#bbdefb' : 'transparent',
              '&:hover': {
                bgcolor: theme.palette.sections?.products?.main || '#90caf9'
              },
              borderLeft: expandedSections.products ? 
                `3px solid ${theme.palette.sections?.products?.dark || '#42a5f5'}` : 'none'
            }}
            onClick={() => toggleSection('products')}
          >
            <ListItemIcon>
              <RestaurantIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
            {expandedSections.products ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          
          <Collapse in={expandedSections.products} timeout="auto">
            <List component="div" disablePadding sx={{ 
              bgcolor: theme.palette.sections?.products?.light || '#bbdefb',
              opacity: 0.8
            }}>
              <ListItemButton 
                component={Link} 
                to="/products/types"
                selected={isActive('/products/types')}
                onClick={onNavigate}
                sx={{ 
                  pl: 4,
                  borderLeft: isActive('/products/types') ? 
                    `3px solid ${theme.palette.sections?.products?.dark || '#42a5f5'}` : 'none',
                  '&.Mui-selected': {
                    bgcolor: theme.palette.sections?.products?.main || '#90caf9',
                    '&:hover': {
                      bgcolor: theme.palette.sections?.products?.main || '#90caf9'
                    }
                  }
                }}
              >
                <ListItemText primary="Product Types" />
              </ListItemButton>
              <ListItemButton 
                component={Link} 
                to="/products"
                selected={isActive('/products')}
                onClick={onNavigate}
                sx={{ 
                  pl: 4,
                  borderLeft: isActive('/products') ? 
                    `3px solid ${theme.palette.sections?.products?.dark || '#42a5f5'}` : 'none',
                  '&.Mui-selected': {
                    bgcolor: theme.palette.sections?.products?.main || '#90caf9',
                    '&:hover': {
                      bgcolor: theme.palette.sections?.products?.main || '#90caf9'
                    }
                  }
                }}
              >
                <ListItemText primary="Products" />
              </ListItemButton>
              <ListItemButton 
                component={Link} 
                to="/recipes"
                selected={isActive('/recipes')}
                onClick={onNavigate}
                sx={{ 
                  pl: 4,
                  borderLeft: isActive('/recipes') ? 
                    `3px solid ${theme.palette.sections?.products?.dark || '#42a5f5'}` : 'none',
                  '&.Mui-selected': {
                    bgcolor: theme.palette.sections?.products?.main || '#90caf9',
                    '&:hover': {
                      bgcolor: theme.palette.sections?.products?.main || '#90caf9'
                    }
                  }
                }}
              >
                <ListItemText primary="Recipes" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Collapse>
      
      <Divider sx={{ my: 1 }} />
      
      {/* Batches Section */}
      <ListItemButton onClick={() => toggleSection('batches')}>
        <ListItemIcon>
          <InventoryIcon />
        </ListItemIcon>
        <ListItemText primary="Batches" />
        {expandedSections.batches ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      
      <Collapse in={expandedSections.batches} timeout="auto">
        <List component="div" disablePadding>
          <ListItemButton 
            component={Link} 
            to="/ingredients/batches"
            selected={isActive('/ingredients/batches')}
            onClick={onNavigate}
            sx={{ 
              pl: 4,
              borderLeft: isActive('/ingredients/batches') ? 
                `3px solid ${theme.palette.sections?.batches?.dark || '#66bb6a'}` : 'none',
              '&.Mui-selected': {
                bgcolor: theme.palette.sections?.batches?.main || '#81c784',
                '&:hover': {
                  bgcolor: theme.palette.sections?.batches?.main || '#81c784'
                }
              }
            }}
          >
            <ListItemText primary="Ingredient Batches" />
          </ListItemButton>
          <ListItemButton 
            component={Link} 
            to="/products/batches"
            selected={isActive('/products/batches')}
            onClick={onNavigate}
            sx={{ 
              pl: 4,
              borderLeft: isActive('/products/batches') ? 
                `3px solid ${theme.palette.sections?.batches?.dark || '#66bb6a'}` : 'none',
              '&.Mui-selected': {
                bgcolor: theme.palette.sections?.batches?.main || '#81c784',
                '&:hover': {
                  bgcolor: theme.palette.sections?.batches?.main || '#81c784'
                }
              }
            }}
          >
            <ListItemText primary="Product Batches" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Dashboard Section */}
      <ListItemButton
        component={Link}
        to="/welcome"
        selected={isActive('/welcome')}
        onClick={onNavigate}
      >
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
    </List>
  );
};

export default SidebarNav;
