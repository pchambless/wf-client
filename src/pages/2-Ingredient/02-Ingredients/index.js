import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CrudLayout from '@crud/CrudLayout';
import PageHeader from '@layout/PageHeader';
import SelectorPanel from '@components/1-page/SelectorPanel';
import { pageMap } from './pageMap';
import navigationStore from '@stores/navigationStore';
import { ROUTES } from '@config/RouteConstants';
import { trackPageMap } from '@utils/debugPageMap';

const IngredientsPage = observer(() => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  useEffect(() => {
    navigationStore.setBreadcrumbs([
      { label: ROUTES.DASHBOARD.label, path: ROUTES.DASHBOARD.path },
      { label: ROUTES.INGREDIENT_TYPES.label, path: ROUTES.INGREDIENT_TYPES.path },
      { label: ROUTES.INGREDIENTS.label, path: ROUTES.INGREDIENTS.path }
    ]);
    
    navigationStore.setPageTitle(ROUTES.INGREDIENTS.label);
  }, []);
  
  // Track pageMap integrity
  trackPageMap(pageMap, 'IngredientsPage');
  
  return (
    <Box>
      <PageHeader
        title="Ingredients"
        description="Manage your ingredients inventory"
        icon={ListAltIcon}
        selectors={
          <SelectorPanel 
            pageId={pageMap.id} 
            onSelectionChange={() => setRefreshTrigger(prev => prev + 1)} 
          />
        }
      />
      
      <CrudLayout
        pageMap={pageMap}
        refreshTrigger={refreshTrigger}
      />
    </Box>
  );
});

export default IngredientsPage;
