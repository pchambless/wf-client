import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import CrudLayout from '../../../components/crud/CrudLayout';
import { columns } from './columns';
import NavigationHeader from '../../../components/navigation/NavigationHeader';
import { useBreadcrumbs } from '../../../contexts/BreadcrumbContext';
import createLogger from '../../../utils/logger';

const log = createLogger('ProductTypes');

const ProductTypes = () => {
  const navigate = useNavigate();
  const { setCrumbTrail, addEntityCrumb } = useBreadcrumbs();
  
  // Set initial breadcrumbs
  useEffect(() => {
    setCrumbTrail([
      { label: 'Dashboard', path: '/welcome' },
      { label: 'Products', path: '/products/types' }
    ]);
  }, [setCrumbTrail]);
  
  // Set column map configuration
  const columnMap = {
    dbTable: 'product_types',
    idField: 'prodTypeID',
    columns: columns
  };
  
  // Handle row selection (navigation to next level)
  const handleRowSelection = (row) => {
    if (row?.prodTypeID) {
      // Add entity crumb before navigation
      addEntityCrumb(row, 'productType', `/products/types/${row.prodTypeID}/products`);
      
      // Then navigate
      navigate(`/products/types/${row.prodTypeID}/products`);
      log.debug(`Navigating to products for type ${row.prodTypeID}`);
    }
  };
  
  return (
    <>
      <NavigationHeader title="Product Types" />
      
      <Box sx={{ my: 3 }}>
        <CrudLayout
          columnMap={columnMap}
          listEvent="prodTypeList"
          onRowSelection={handleRowSelection}
        />
      </Box>
    </>
  );
};

export default ProductTypes;
