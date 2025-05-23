import React, { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Collapse, 
  Divider 
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'; // Use this instead of CircleIcon
import { useNavigate, useLocation } from 'react-router-dom';
import * as Icons from '@mui/icons-material';
// Update this import to use the new module
import { getNavigationSections } from '../../../../navigation/NavigationUtils';
import createLogger from '@utils/logger';

const log = createLogger('SidebarNav');

const SidebarNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sections = getNavigationSections();
  
  // Track expanded sections
  const [expandedSections, setExpandedSections] = useState(
    sections.reduce((acc, section) => {
      acc[section.id] = true; // Start with all sections expanded
      return acc;
    }, {})
  );
  
  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  // Check if a route is active
  const isActiveRoute = (path) => {
    // For parameterized routes, we need to check the base path
    const basePath = path.split('/:')[0];
    return location.pathname === path || 
           location.pathname.startsWith(`${basePath}/`);
  };
  
  // Navigate to route
  const handleNavigate = (routeId, path, requiredParams) => {
    // For routes that require params, we could:
    if (requiredParams && requiredParams.length > 0) {
      log.info(`Route ${routeId} requires parameters:`, requiredParams);
      
      // For now, if it's an ingredients route, navigate to ingredient types first
      if (path.includes('/ingredients/') && path.includes('/:ingrTypeID/')) {
        navigate('/ingredients/types');
        return;
      }
      
      // For product routes, navigate to product types first
      if (path.includes('/products/') && path.includes('/:prodTypeID/')) {
        navigate('/products/types');
        return;
      }
    }
    
    navigate(path);
  };
  
  return (
    <List component="nav" sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {sections.map(section => {
        // Get the icon component - with fallback
        const SectionIconName = section.icon || 'FiberManualRecord';
        const SectionIcon = Icons[SectionIconName] || FiberManualRecordIcon;
        
        return (
          <React.Fragment key={section.id}>
            {/* Section header with color indicator */}
            <ListItem 
              button 
              onClick={() => toggleSection(section.id)}
              sx={{
                borderLeft: `4px solid ${section.color || '#ccc'}`,
                bgcolor: expandedSections[section.id] ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
              }}
            >
              <ListItemIcon>
                <SectionIcon />
              </ListItemIcon>
              <ListItemText 
                primary={section.label} 
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
              {expandedSections[section.id] ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            
            {/* Section items */}
            <Collapse in={expandedSections[section.id]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {section.items.map(item => {
                  // Get the icon component - with fallback
                  const ItemIconName = item.icon || 'FiberManualRecord';
                  const ItemIcon = Icons[ItemIconName] || FiberManualRecordIcon;
                  const isActive = isActiveRoute(item.path);
                  
                  return (
                    <ListItem 
                      key={item.id}
                      button 
                      onClick={() => handleNavigate(item.id, item.path, item.requiredParams)}
                      sx={{ 
                        pl: 4,
                        borderLeft: isActive ? `4px solid ${section.color || '#ccc'}` : '4px solid transparent',
                        bgcolor: isActive ? 'rgba(0, 0, 0, 0.08)' : 'transparent'
                      }}
                    >
                      <ListItemIcon>
                        <ItemIcon />
                      </ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItem>
                  );
                })}
              </List>
            </Collapse>
            
            <Divider variant="middle" />
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default SidebarNav;
