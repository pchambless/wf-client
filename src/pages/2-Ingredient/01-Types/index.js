import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import CrudLayout from '@crud/CrudLayout';
import { pageMap } from './pageMap'; // Import the raw pageMap
import navigationStore from '@stores/navigationStore';
import accountStore from '@stores/accountStore';
import createLogger from '@utils/logger';
import { ROUTES } from '@config/RouteConstants';
import { trackPageMap } from '@utils/debugPageMap';

const log = createLogger('IngredientTypes');

const IngredientTypesPage = observer(() => {
  
  // Set up breadcrumbs and navigation state on mount
  useEffect(() => {
    // Set breadcrumbs using route constants
    navigationStore.setBreadcrumbs([
      { label: ROUTES.DASHBOARD.label, path: ROUTES.DASHBOARD.path },
      { label: ROUTES.INGREDIENT_TYPES.label, path: ROUTES.INGREDIENT_TYPES.path }
    ]);
    
    // Set page title from constants
    navigationStore.setPageTitle(ROUTES.INGREDIENT_TYPES.label);
    
    // Clear any ingredient-specific selection when viewing types
    if (accountStore.getSelectedEntity('ingrTypeID')) {
      log.debug('Clearing previously selected ingredient type');
      accountStore.setSelectedEntity('ingrTypeID', null);
    }
  }, []);
  
  // Track the original pageMap
  trackPageMap(pageMap, 'IngredientTypesPage');
  
  // Log the resolved pageMap for debugging
  console.log('Page using pageMap:', {
    id: pageMap.id,
    table: pageMap.pageConfig.table
  });
  
  return (
    <CrudLayout
      pageMap={pageMap}
    />
  );
});

export default IngredientTypesPage;
