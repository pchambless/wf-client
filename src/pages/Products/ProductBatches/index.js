import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CrudLayout from '../../../components/1-page/c-crud/CrudLayout';
import { columns } from './columns';
import { setVars } from '../../../utils/externalStore';
import createLogger from '../../../utils/logger';
import NavigationHeader from '../../../components/1-page/b-navigation/cc-PageHeader/NavigationHeader';
import { useBreadcrumbs } from '../../../contexts/BreadcrumbContext';

const log = createLogger('ProductBatches');

const ProductBatches = () => {
  const navigate = useNavigate();
  const { typeId, productId } = useParams();
  const { navigateToCrumb, addEntityCrumb } = useBreadcrumbs();
  
  // Set the required parameter for prodBtchList event
  useEffect(() => {
    if (productId) {
      log.debug(`Setting :prodID=${productId} for batch list`);
      setVars(':prodID', productId);
    }
  }, [productId]);
  
  // Column map configuration
  const columnMap = {
    dbTable: 'product_batches',
    idField: 'prodBtchID',
    columns: columns
  };
  
  // Back button handler
  const handleBack = () => {
    const path = `/products/types/${typeId}/products`;
    navigate(path);
    navigateToCrumb(path);
    log.debug('Navigated back to Products list');
  };
  
  // Add batch selection to breadcrumbs if needed
  const handleBatchSelection = (batch) => {
    if (batch) {
      addEntityCrumb(
        batch,
        'productBatch',
        `/products/types/${typeId}/products/${productId}/batches/${batch.prodBtchID}`
      );
    }
  };
  
  return (
    <>
      <NavigationHeader 
        title={`Batches for Product #${productId}`}
      />
      
      <Box sx={{ mb: 2 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          variant="outlined"
        >
          Back to Products
        </Button>
      </Box>
      
      <CrudLayout
        columnMap={columnMap}
        listEvent="prodBtchList"
        onRowSelection={handleBatchSelection}
      />
    </>
  );
};

export default ProductBatches;
