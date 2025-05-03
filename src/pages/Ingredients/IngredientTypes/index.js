import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBreadcrumbs } from '../../../contexts/BreadcrumbContext';
import CrudLayout from '../../../components/crud/CrudLayout';
import columnMap from './columns';
import createLogger from '../../../utils/logger';

const log = createLogger('IngredientTypes');

const IngredientTypes = () => {
  const navigate = useNavigate();
  const { setCrumbTrail, addEntityCrumb } = useBreadcrumbs();
  
  useEffect(() => {
    setCrumbTrail([
      { label: 'Dashboard', path: '/welcome' },
      { label: 'Ingredients', path: '/ingredients/types' }
    ]);
  }, [setCrumbTrail]);

  useEffect(() => {
    // Use logger for the JSON representation too
    log.info('ColumnMap (JSON):\n' + 
      JSON.stringify(columnMap, null, 2));
  }, []);
  
  return (
    <CrudLayout
      columnMap={columnMap}
      listEvent={columnMap.listEvent}  // Explicitly pass listEvent
      navigate={navigate}
      addEntityCrumb={addEntityCrumb}
    />
  );
};

export default IngredientTypes;
