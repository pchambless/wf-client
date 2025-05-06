import React from 'react';
import CrudLayout from '../../../components/crud/CrudLayout';
import getColumnMap from './columns';
import createLogger from '../../../utils/logger';

const log = createLogger('IngredientTypes');

const IngredientTypes = () => {
  // Call the function to get the column map object
  const columnMap = getColumnMap();
  
  log.debug('ColumnMap loaded:', !!columnMap);
  
  return (
    <CrudLayout
      columnMap={columnMap}
      pageTitle="Ingredient Types"
      listEvent={columnMap.listEvent}
    />
  );
};

// Export without withMainLayout
export default IngredientTypes;
