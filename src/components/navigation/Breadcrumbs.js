import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs, Typography, Link as MuiLink } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs';

const Breadcrumbs = () => {
  const { breadcrumbs } = useBreadcrumbs();
  
  return (
    <MuiBreadcrumbs 
      separator={<NavigateNextIcon fontSize="small" />} 
      aria-label="breadcrumb"
      sx={{ mb: 2, mt: 1 }}
    >
      <MuiLink
        component={Link}
        to="/"
        color="inherit"
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
        Home
      </MuiLink>
      
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        return isLast ? (
          <Typography key={crumb.path} color="text.primary">
            {crumb.label}
          </Typography>
        ) : (
          <MuiLink 
            key={crumb.path} 
            component={Link} 
            to={crumb.path}
            color="inherit"
          >
            {crumb.label}
          </MuiLink>
        );
      })}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
