import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import CrudLayout from '../../../components/crud/CrudLayout';
import { columns } from './columns';
import NavigationHeader from '../../../components/navigation/NavigationHeader';
import { useBreadcrumbs } from '../../../contexts/BreadcrumbContext';
import createLogger from '../../../utils/logger';

const log = createLogger('IngredientTypes');

const IngredientTypes = () => {
  const navigate = useNavigate();
  // Add addEntityCrumb to the destructured properties
  const { setCrumbTrail, addEntityCrumb } = useBreadcrumbs();
  
  // Set initial breadcrumbs
  useEffect(() => {
    setCrumbTrail([
      { label: 'Dashboard', path: '/welcome' },
      { label: 'Ingredients', path: '/ingredients/types' }
    ]);
  }, [setCrumbTrail]);
  
  // Convert existing ingrTypes.js content to local columns.js
  const columnMap = {
    dbTable: 'ingredient_types',
    idField: 'ingrTypeID',
    columns: columns
  };
  
  // Handle row selection (navigation to next level)
  const handleRowSelection = (row) => {
    if (row?.ingrTypeID) {
      // Add entity crumb before navigation
      addEntityCrumb(row, 'ingredientType', `/ingredients/types/${row.ingrTypeID}/ingredients`);
      
      // Then navigate
      navigate(`/ingredients/types/${row.ingrTypeID}/ingredients`);
      log.debug(`Navigating to ingredients for type ${row.ingrTypeID}`);
    }
  };
  
  return (
    <>
      <NavigationHeader title="Ingredient Types" />
      
      <Box sx={{ my: 3 }}>
        <CrudLayout
          columnMap={columnMap}
          listEvent="ingrTypeList"
          onRowSelection={handleRowSelection}
        />
      </Box>
    </>
  );
};

export default IngredientTypes;
