import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { dashboardConfig } from './config';
import createLogger from '../../utils/logger';

const log = createLogger('Dashboard');

const Dashboard = () => {
  log.debug('Rendering Dashboard', { config: dashboardConfig });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h4">{dashboardConfig.layout.title}</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {dashboardConfig.layout.description}
          </Typography>
        </Paper>
      </Grid>

      {/* Stats Overview */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6">{dashboardConfig.widgets.stats.title}</Typography>
          {/* Stats component will go here */}
        </Paper>
      </Grid>

      {/* Inventory Status */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6">{dashboardConfig.widgets.inventory.title}</Typography>
          {/* Inventory component will go here */}
        </Paper>
      </Grid>

      {/* Recent Activity */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6">{dashboardConfig.widgets.recentActivity.title}</Typography>
          {/* Activity component will go here */}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
