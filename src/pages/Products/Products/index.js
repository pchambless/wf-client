import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CrudLayout from '../../../components/crud/CrudLayout';
import { columns } from './columns';
import { setVars } from '../../../utils/externalStore';
import createLogger from '../../../utils/logger';
import NavigationHeader from '../../../components/navigation/NavigationHeader';
import { useBreadcrumbs } from '../../../contexts/BreadcrumbContext';

const log = createLogger('Products');

const Products = () => {
  const navigate = useNavigate();
  const { typeId } = useParams();
  const { navigateToCrumb, addEntityCrumb } = useBreadcrumbs();
  
  // Set the required parameter for prodList event
  useEffect(() => {
    if (typeId) {
      log.debug(`Setting :prodTypeID=${typeId} for product list`);
      setVars(':prodTypeID', typeId);
    }
  }, [typeId]);
  
  // Column map configuration
  const columnMap = {
    dbTable: 'products',
    idField: 'prodID',
    columns: columns
  };
  
  // Back button handler
  const handleBack = () => {
    navigate('/products/types');
    navigateToCrumb('/products/types');
    log.debug('Navigated back to Product Types list');
  };
  
  // Handle product selection
  const handleProductSelection = (product) => {
    if (product?.prodID) {
      addEntityCrumb(
        product, 
        'product',
        `/products/types/${typeId}/products/${product.prodID}/batches`
      );
      
      navigate(`/products/types/${typeId}/products/${product.prodID}/batches`);
      log.debug(`Navigating to batches for product ${product.prodID}`);
    }
  };
  
  return (
    <>
      <NavigationHeader 
        title={`Products for Type #${typeId}`}
      />
      
      <Box sx={{ mb: 2 }}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          variant="outlined"
        >
          Back to Product Types
        </Button>
      </Box>
      
      <CrudLayout
        columnMap={columnMap}
        listEvent="prodList"
        onRowSelection={handleProductSelection}
      />
    </>
  );
};

export default Products;
