import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import createLogger from '../../../utils/logger';
import { useBreadcrumbs } from '../../../contexts/BreadcrumbContext';
import CrudLayout from '../../../layouts/CrudLayout';
import columns from './columns';

const log = createLogger('IngredientTypes', 4); // Set to debug level

const IngredientTypes = () => {
  const navigate = useNavigate();
  const { setCrumbTrail, addEntityCrumb } = useBreadcrumbs();
  
  // Set initial breadcrumbs
  useEffect(() => {
    setCrumbTrail([
      { label: 'Dashboard', path: '/welcome' },
      { label: 'Ingredients', path: '/ingredients/types' }
    ]);
  }, [setCrumbTrail]);
  
  // Column map definition
  const columnMap = {
    dbTable: 'ingredient_types',
    idField: 'ingrTypeID',
    entityType: 'ingredientType',
    columns: columns
  };
  
  // Row selection handler
  const handleRowSelection = (row) => {
    log.debug('Row selection with data:', row);
    
    if (row?.ingrTypeID) {
      // Add entity crumb before navigation
      log.debug(`Adding crumb for ingredient type: ${row.ingrTypeID}`);
      addEntityCrumb(row, 'ingredientType', `/ingredients/types/${row.ingrTypeID}/ingredients`);
      
      // Then navigate using ingrTypeID consistently
      log.debug(`Navigating to ingredients for type ${row.ingrTypeID}`);
      navigate(`/ingredients/types/${row.ingrTypeID}/ingredients`);
    } else {
      log.error('Cannot navigate: No ingrTypeID found in row data:', row);
    }
  };
  
  return (
    <CrudLayout
      title="Ingredient Types"
      columnMap={columnMap}
      listEvent="ingrTypeList"
      onRowSelection={handleRowSelection}
    />
  );
};

export default IngredientTypes;
