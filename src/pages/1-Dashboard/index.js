import React, { useState, useEffect } from 'react';
import { 
  Typography, Grid, Card, CardContent, CardActions, Button, Box, Paper
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard'; // Keep this import
import RestaurantIcon from '@mui/icons-material/Restaurant';
import InventoryIcon from '@mui/icons-material/Inventory';
import LiquorIcon from '@mui/icons-material/Liquor';
import { useNavigate } from 'react-router-dom';
import { getNavigationLinks } from '../../utils/navigationHelper';
import createLogger from '@utils/logger';
import { useModal } from '@modal';
// Import our new hook
import usePageHeader from '../../hooks/usePageHeader';

const log = createLogger('Dashboard');

const Dashboard = () => {
  const navigate = useNavigate();
  const { showModal } = useModal();
  
  // Use the page header hook
  usePageHeader({
    title: 'Dashboard',
    description: 'Welcome to WhatsFresh management system', 
    icon: DashboardIcon
  });
  
  // Initialize state for navigation links
  const [navLinks, setNavLinks] = useState({
    ingredients: [],
    products: [],
    production: []
  });
  
  // Load navigation links when component mounts
  useEffect(() => {
    const loadNavLinks = async () => {
      try {
        const [ingredients, products, production] = await Promise.all([
          getNavigationLinks('ingredients'),
          getNavigationLinks('products'),
          getNavigationLinks('batches')
        ]);
        
        log.debug('Loaded navigation links:', { ingredients, products, production });
        
        setNavLinks({
          ingredients,
          products,
          production
        });
      } catch (error) {
        log.error('Failed to load navigation links:', error);
      }
    };
    
    loadNavLinks();
  }, []);
  
  // Handle test modal button click
  const handleTestModal = () => {
    log.info('Test modal button clicked');
    showModal({
      title: 'Test Modal from Dashboard',
      content: <div>This is a test modal to verify if the modal system works correctly.</div>,
      actions: [
        {
          label: 'Close',
          onClick: () => {
            log.info('Modal close button clicked');
          }
        }
      ],
      size: 'md'
    });
  };

  console.log("Dashboard rendering");

  useEffect(() => {
    console.log("Dashboard mounted");
    
    return () => {
      console.log("Dashboard unmounting");
    };
  }, []);
  
  return (
    <>
      {/* Debug message - you can remove this in production */}
      <Box 
        sx={{ 
          p: 2, 
          mb: 2, 
          bgcolor: 'error.main', 
          color: 'white',
          border: '3px solid black',
          borderRadius: 1
        }}
      >
        <Typography variant="h5">DASHBOARD IS RENDERING</Typography>
      </Box>
      
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          bgcolor: 'background.paper',
          border: '4px solid red',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">
            Getting Started
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleTestModal}
          >
            Test Modal System
          </Button>
        </Box>
        <Typography paragraph>
          WhatsFresh helps you manage your ingredients, products, recipes, and production
          batches in one centralized system. Use the navigation sidebar to access different
          areas of the application.
        </Typography>
        <Typography paragraph>
          Start by defining your ingredient types and ingredients, then create products and recipes.
          Finally, track your production with batches to maintain complete traceability.
        </Typography>
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ mb: 2, pl: 1 }}>
        Quick Access
      </Typography>
      
      <Grid container spacing={3}>
        {/* Ingredients Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            bgcolor: theme => theme.palette.sections.ingredients.light,
            '&:hover': { boxShadow: 6 },
            transition: 'box-shadow 0.3s'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LiquorIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Ingredients
                </Typography>
              </Box>
              <Typography variant="body2">
                Define and manage your ingredients and ingredient types
              </Typography>
            </CardContent>
            <CardActions>
              {navLinks.ingredients.map(link => (
                <Button 
                  key={link.path}
                  size="small" 
                  onClick={() => navigate(link.path)}
                >
                  {link.label}
                </Button>
              ))}
            </CardActions>
          </Card>
        </Grid>
        
        {/* Products Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            bgcolor: theme => theme.palette.sections.products.light,
            '&:hover': { boxShadow: 6 },
            transition: 'box-shadow 0.3s'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <RestaurantIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Products
                </Typography>
              </Box>
              <Typography variant="body2">
                Create and manage your products and recipes
              </Typography>
            </CardContent>
            <CardActions>
              {navLinks.products.map(link => (
                <Button 
                  key={link.path}
                  size="small" 
                  onClick={() => navigate(link.path)}
                >
                  {link.label}
                </Button>
              ))}
            </CardActions>
          </Card>
        </Grid>
        
        {/* Batches Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            bgcolor: theme => theme.palette.sections.batches.light,
            '&:hover': { boxShadow: 6 },
            transition: 'box-shadow 0.3s'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InventoryIcon sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Production
                </Typography>
              </Box>
              <Typography variant="body2">
                Track your production with ingredient and product batches
              </Typography>
            </CardContent>
            <CardActions>
              {navLinks.production.map(link => (
                <Button 
                  key={link.path}
                  size="small" 
                  onClick={() => navigate(link.path)}
                >
                  {link.label}
                </Button>
              ))}
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
