import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Login from '../pages/Login';
import { dashboardRoutes as importedDashboardRoutes } from './dashboard';
import { ingredientRoutes as importedIngredientRoutes } from './ingredients';
import { productRoutes as importedProductRoutes } from './products';
import { accountRoutes as importedAccountRoutes } from './account';
import createLogger from '../utils/logger';

// Set default empty arrays to prevent undefined errors
const dashboardRoutes = importedDashboardRoutes || [];
const ingredientRoutes = importedIngredientRoutes || [];
const productRoutes = importedProductRoutes || [];
const accountRoutes = importedAccountRoutes || [];

const log = createLogger('AppRoutes');

// Add debugging to verify routes are loaded
log.debug('Routes loaded:', {
  dashboardRoutes: Array.isArray(dashboardRoutes),
  ingredientRoutes: Array.isArray(ingredientRoutes),
  productRoutes: Array.isArray(productRoutes),
  accountRoutes: Array.isArray(accountRoutes)
});

const AppRoutes = () => {
  // Add defensive check before rendering routes
  if (!dashboardRoutes || !ingredientRoutes || !productRoutes || !accountRoutes) {
    log.error('One or more route arrays is undefined', {
      dashboardRoutes,
      ingredientRoutes,
      productRoutes, 
      accountRoutes
    });
    
    // Simple error display when routes aren't ready
    return (
      <Routes>
        <Route path="*" element={
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Loading routes...</h2>
          </div>
        } />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Login page - outside of MainLayout */}
      <Route path="/login" element={<Login />} />

      {/* Root redirects to login instead of welcome */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* All other pages - wrapped in MainLayout */}
      <Route element={<MainLayout />}>
        {/* Dashboard routes */}
        {dashboardRoutes.map((route, index) => (
          <Route 
            key={`dashboard-route-${index}`} 
            path={route.path} 
            element={route.element} 
          />
        ))}
        
        {/* Ingredient routes */}
        {ingredientRoutes.map((route, index) => (
          <Route 
            key={`ingredient-route-${index}`} 
            path={route.path} 
            element={route.element} 
          />
        ))}
        
        {/* Product routes */}
        {productRoutes.map((route, index) => (
          <Route 
            key={`product-route-${index}`} 
            path={route.path} 
            element={route.element} 
          />
        ))}
        
        {/* Account routes */}
        {accountRoutes.map((route, index) => (
          <Route 
            key={`account-route-${index}`} 
            path={route.path} 
            element={route.element} 
          />
        ))}
      </Route>
      
      {/* Catch-all for 404 - direct to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
