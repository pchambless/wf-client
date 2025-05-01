import React from 'react';
import { Outlet } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';
import Container from '../../layouts/Container';
import { accountConfig } from './config';
import TabNavigation from '../../components/navigation/TabNavigation';

const AccountPage = () => {
  // Create tabs based on account config
  const tabs = accountConfig.tabs.map(tab => ({
    label: tab.label,
    path: `/account/${tab.pageName.toLowerCase()}`
  }));

  return (
    <Container showHeader={false}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h4" gutterBottom>Account Management</Typography>
        <TabNavigation tabs={tabs} />
        <Outlet /> {/* This will render nested routes */}
      </Paper>
    </Container>
  );
};

export default AccountPage;
