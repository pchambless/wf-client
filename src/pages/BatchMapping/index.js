import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, Paper, Typography } from '@mui/material';
import Container from '../Container';
import createLogger from '../../utils/logger';
import { execEvent } from '../../stores';

const log = createLogger('BatchMappingPage');

const BatchMappingPage = () => {
  const location = useLocation();
  const [productBatch, setProductBatch] = useState(null);
  const [ingredientBatches, setIngredientBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get batch ID from location state or query param
  const batchId = location.state?.batchId || new URLSearchParams(location.search).get('batchId');

  useEffect(() => {
    const loadBatchData = async () => {
      if (!batchId) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch batch details
        const batchData = await execEvent('getProdBatch', { ':prodBatchID': batchId });
        setProductBatch(batchData);
        
        // Fetch mapped ingredient batches
        const mappingData = await execEvent('getMappedBatches', { ':prodBatchID': batchId });
        setIngredientBatches(mappingData || []);
      } catch (error) {
        log.error('Error loading batch mapping data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBatchData();
  }, [batchId]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {productBatch ? `Batch Mapping: ${productBatch.batchCode}` : 'Batch Mapping'}
      </Typography>
      
      {/* Batch mapping content here */}
    </Container>
  );
};

export default BatchMappingPage;
