import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useBreadcrumbs } from '@hooks/useBreadcrumbs';

const Breadcrumbs = () => {
  const { breadcrumbs } = useBreadcrumbs();
  
  if (breadcrumbs.length <= 1) {
    return null;
  }
  
  return (
    <MuiBreadcrumbs aria-label="breadcrumb">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        return isLast ? (
          <Typography key={crumb.path} color="text.primary">
            {crumb.label}
          </Typography>
        ) : (
          <MuiLink
            key={crumb.path}
            component={RouterLink}
            to={crumb.path}
            color="inherit"
            underline="hover"
          >
            {crumb.label}
          </MuiLink>
        );
      })}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
