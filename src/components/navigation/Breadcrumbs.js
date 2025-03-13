import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { usePageStore } from '../../stores';
import createLogger from '../../utils/logger';

const log = createLogger('Breadcrumbs');

const Breadcrumbs = () => {
  const { breadcrumbs } = usePageStore();
  
  if (!breadcrumbs || breadcrumbs.length <= 1) {
    return null; // Don't show breadcrumbs if we only have 'Home' or nothing
  }
  
  log('Rendering breadcrumbs:', breadcrumbs);
  
  return (
    <MuiBreadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        
        return isLast ? (
          <Typography key={index} color="text.primary">
            {crumb.label}
          </Typography>
        ) : (
          <Link
            key={index}
            component={RouterLink}
            to={crumb.path}
            underline="hover"
            color="inherit"
          >
            {crumb.label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
