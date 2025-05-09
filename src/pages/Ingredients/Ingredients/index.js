import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBreadcrumbs } from '../../../contexts/BreadcrumbContext';
import CrudLayout from '@crud/CrudLayout';
import columnMap from './columns';
import createLogger from '@utils/logger';
import { setVars } from '@utils/externalStore';

const log = createLogger('Ingredients');

const Ingredients = () => {
  const navigate = useNavigate();
  const { ingrTypeID } = useParams(); // Use actual field name in params
  const { setCrumbTrail, addEntityCrumb } = useBreadcrumbs();
  
  // Set the ingredient type filter if provided
  useEffect(() => {
    if (ingrTypeID) {
      log.info(`Setting ingredient type filter: ${ingrTypeID}`);
      setVars(':ingrTypeID', ingrTypeID); // Format for external store with colon
    }
  }, [ingrTypeID]);
  
  // Setup breadcrumbs based on whether we have a type filter
  useEffect(() => {
    setCrumbTrail([
      { label: 'Dashboard', path: '/welcome' },
      { label: 'Ingredient Types', path: '/ingredients/types' },
      ingrTypeID ? { label: 'Ingredients', path: `/ingredients/${ingrTypeID}` } : null
    ].filter(Boolean));
    
    // Log the column map for debugging
    log.info('ColumnMap (JSON):\n' + 
      JSON.stringify(columnMap, null, 2));
  }, [setCrumbTrail, ingrTypeID]);
  
  return (
    <CrudLayout
      columnMap={columnMap}
      listEvent={columnMap.listEvent}
      navigate={navigate}
      addEntityCrumb={addEntityCrumb}
    />
  );
};

export default Ingredients;
