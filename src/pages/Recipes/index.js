import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, Paper, Typography } from '@mui/material';
import Container from '../Container';
import createLogger from '../../utils/logger';
import { execEvent } from '../../stores';

const log = createLogger('RecipesPage');

const RecipesPage = () => {
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get product ID from location state or query param
  const productId = location.state?.productId || new URLSearchParams(location.search).get('productId');

  useEffect(() => {
    const loadRecipeData = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch product details
        const productData = await execEvent('getProduct', { ':productID': productId });
        setProduct(productData);
        
        // Fetch recipe ingredients
        const recipeData = await execEvent('getRecipeIngredients', { ':productID': productId });
        setIngredients(recipeData || []);
      } catch (error) {
        log.error('Error loading recipe data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadRecipeData();
  }, [productId]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {product ? `Recipe: ${product.name}` : 'Recipes'}
      </Typography>
      
      {/* Recipe content here */}
    </Container>
  );
};

export default RecipesPage;
