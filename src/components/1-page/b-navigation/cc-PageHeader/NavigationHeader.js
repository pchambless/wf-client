import React from 'react';
import { Box, Typography, Breadcrumbs, Link, Paper } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import createLogger from '@utils/logger';
import { useBreadcrumbs } from '../../../../contexts/BreadcrumbContext';

const log = createLogger('NavigationHeader');

/**
 * NavigationHeader component using the BreadcrumbContext
 */
const NavigationHeader = ({ title }) => {
  const navigate = useNavigate();
  const { crumbs, navigateToCrumb } = useBreadcrumbs();
  
  const handleNavigate = (path) => {
    log.debug(`Navigating to: ${path}`);
    navigateToCrumb(path);
    navigate(path);
  };
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        mb: 2, 
        bgcolor: 'background.paper',
        borderRadius: 1
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Page title */}
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        
        {/* Breadcrumbs navigation */}
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {crumbs.map((crumb, index) => {
            // Last crumb is current page - not a link
            const isLast = index === crumbs.length - 1;
            const isFirst = index === 0;
            
            return isLast ? (
              <Typography key={crumb.path || index} color="text.primary">
                {crumb.label}
              </Typography>
            ) : (
              <Link
                key={crumb.path || index}
                component={RouterLink}
                to={crumb.path || '#'}
                onClick={() => handleNavigate(crumb.path)}
                color="inherit"
                sx={isFirst ? { display: 'flex', alignItems: 'center' } : {}}
              >
                {isFirst && <DashboardIcon sx={{ mr: 0.5 }} fontSize="small" />}
                {crumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      </Box>
    </Paper>
  );
};

export default NavigationHeader;
