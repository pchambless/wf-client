import React from 'react';
import { PageHeader, PageContent } from '../components/1-page/a-layout';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Box,
  Paper
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import InventoryIcon from '@mui/icons-material/Inventory';
import LiquorIcon from '@mui/icons-material/Liquor';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        title="Welcome to WhatsFresh"
        description="Your complete product and ingredient management system"
        icon={DashboardIcon}
      />
      
      <PageContent withPaper={false}>
        <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: 'background.paper' }}>
          <Typography variant="h5" gutterBottom>
            Getting Started
          </Typography>
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
                <Button 
                  size="small" 
                  onClick={() => navigate('/ingredients')}
                >
                  Manage Ingredients
                </Button>
                <Button 
                  size="small" 
                  onClick={() => navigate('/ingredients/types')}
                >
                  Ingredient Types
                </Button>
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
                <Button 
                  size="small" 
                  onClick={() => navigate('/products')}
                >
                  Manage Products
                </Button>
                <Button 
                  size="small" 
                  onClick={() => navigate('/recipes')}
                >
                  Recipes
                </Button>
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
                <Button 
                  size="small" 
                  onClick={() => navigate('/ingredients/batches')}
                >
                  Ingredient Batches
                </Button>
                <Button 
                  size="small" 
                  onClick={() => navigate('/products/batches')}
                >
                  Product Batches
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </PageContent>
    </>
  );
};

export default Welcome;
