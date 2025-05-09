import React from 'react';
import CrudLayout from '@crud/CrudLayout';
import getPageMap from './pageMap';
import createLogger from '@utils/logger';

const log = createLogger('IngredientTypes');

const IngredientTypes = () => {
  // Get the pageMap from your co-located pageMap.js file
  const pageMap = getPageMap();
  
  log.debug('PageMap loaded:', {
    hasPageMap: !!pageMap,
    hasColumnMap: !!pageMap?.columnMap,
    pageConfig: pageMap?.pageConfig
  });
  
  return (
    <CrudLayout
      pageMap={pageMap}
    />
  );
};

export default IngredientTypes;
