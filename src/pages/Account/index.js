import React from 'react';
import { Outlet } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';
import MainLayout from '../../components/layout/MainLayout'; // Changed import
import { accountConfig } from './config';


const AccountPage = () => {
  // Create tabs based on account config
  const tabs = accountConfig.tabs.map(tab => ({
    label: tab.label,
    path: `/account/${tab.pageName.toLowerCase()}`
  }));

  return (
    // No need for showHeader prop since the header is part of MainLayout now
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h4" gutterBottom>Account Management</Typography>
      <Outlet /> {/* This will render nested routes */}
    </Paper>
  );
};

export default AccountPage;
