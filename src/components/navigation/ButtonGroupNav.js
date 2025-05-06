import React, { useState, useCallback, useMemo } from 'react';
import { ButtonGroup, Button, Menu, MenuItem, Box } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate, useLocation } from 'react-router-dom';
import createLogger from '../../utils/logger';

// Import route modules
import { ingredientRoutes } from '../../pages/Ingredients/routes';
import { productRoutes } from '../../pages/Products/routes';
import { accountRoutes } from '../../pages/Account/routes';

const log = createLogger('ButtonGroupNav');

// Individual navigation button group with dropdown
const NavButtonGroup = ({ section }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if this section or any of its items is active
  const isActive = section.items.some(item => 
    location.pathname === item.path || 
    location.pathname.startsWith(`${item.path}/`)
  );
  
  // Memoize handler functions to prevent re-renders
  const handleMainButtonClick = useCallback(() => {
    log.debug(`Navigating to ${section.defaultPath}`);
    navigate(section.defaultPath);
  }, [navigate, section.defaultPath]);
  
  const handleDropdownToggle = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);
  
  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);
  
  const handleItemClick = useCallback((path) => {
    log.debug(`Navigating to ${path}`);
    navigate(path);
    setAnchorEl(null);
  }, [navigate]);
  
  return (
    <ButtonGroup 
      variant={isActive ? "contained" : "outlined"} 
      color={isActive ? "primary" : "inherit"}
      sx={{ mx: 1 }}
    >
      <Button onClick={handleMainButtonClick}>
        {section.label}
      </Button>
      <Button 
        size="small"
        onClick={handleDropdownToggle}
      >
        <ArrowDropDownIcon />
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        {section.items.map(item => (
          <MenuItem 
            key={item.path}
            onClick={() => handleItemClick(item.path)}
            sx={{
              fontWeight: location.pathname === item.path ? 'bold' : 'normal'
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </ButtonGroup>
  );
};

// Main navigation component - memoized to prevent unnecessary re-renders
const ButtonGroupNav = React.memo(() => {
  // Transform route modules into navigation sections
  const sections = useMemo(() => {
    // Helper to extract top-level routes and sub-routes
    const routesToNavItems = (routes, basePath, label, defaultPath) => {
      // Get all routes that match the base path
      const relevantRoutes = routes.filter(route => 
        route.path.startsWith(basePath) && 
        // Only include non-parameterized routes for navigation
        !route.path.includes('/:')
      );
      
      if (relevantRoutes.length === 0) return null;
      
      // Find top-level items for dropdown
      const items = relevantRoutes.map(route => ({
        label: route.label || route.path.split('/').pop(),
        path: route.path
      }));
      
      return {
        label,
        defaultPath: defaultPath || items[0]?.path,
        items
      };
    };
    
    return [
      // Ingredients section
      routesToNavItems(ingredientRoutes, '/ingredients', 'Ingredients', '/ingredients/types'),
      
      // Products section
      routesToNavItems(productRoutes, '/products', 'Products', '/products/types'),
      
      // Reference/Account section (adjust path as needed)
      routesToNavItems(accountRoutes, '/account', 'Reference', '/account/vendors')
    ].filter(Boolean); // Remove null items
  }, []);
  
  log.debug('Rendering ButtonGroupNav with sections from routes');
  
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'flex-start',
      p: 1,
      backgroundColor: 'background.default',
      borderBottom: '1px solid',
      borderColor: 'divider'
    }}>
      {sections.map(section => (
        <NavButtonGroup key={section.defaultPath} section={section} />
      ))}
    </Box>
  );
});

ButtonGroupNav.displayName = 'ButtonGroupNav';

export default ButtonGroupNav;
