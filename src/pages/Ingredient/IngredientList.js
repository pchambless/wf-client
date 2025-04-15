import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import CrudLayout from '../../components/crud/CrudLayout';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import ContextBar from '../../components/navigation/ContextBar';
import { execEvent } from '../../stores/eventStore';
import { setVar } from '../../utils/externalStore';
import createLogger from '../../utils/logger';

const log = createLogger('IngredientListPage');

// Column definition for this specific page
const columnMap = {
  dbTable: 'ingredients',
  idField: 'ingrID',
  columns: [
    { field: 'ingrID', label: 'ID', where: 1, group: 1 },
    { field: 'name', label: 'Ingredient', group: 1 },
    { field: 'status', label: 'Status', group: 1 },
    { field: 'ingrTypeID', label: 'Type ID', hide: true }
  ]
};

const IngredientListPage = () => {
  const { typeId } = useParams();
  const navigate = useNavigate();
  const [typeDetails, setTypeDetails] = useState(null);
  
  // Set parameters needed for data loading
  useEffect(() => {
    setVar(':ingrTypeID', typeId);
    log.debug(`Set parameter :ingrTypeID=${typeId}`);
    
    // Load ingredient type details for display
    const loadTypeDetails = async () => {
      try {
        const result = await execEvent('ingrTypeGet', { ':ingrTypeID': typeId });
        setTypeDetails(result);
      } catch (err) {
        log.error('Failed to load ingredient type details:', err);
      }
    };
    
    loadTypeDetails();
  }, [typeId]);
  
  // Navigate to batches page when an ingredient is selected
  const handleRowSelection = (row) => {
    if (row && row.ingrID) {
      navigate(`/ingredients/types/${typeId}/ingredients/${row.ingrID}/batches`);
    }
  };
  
  // Context-specific actions
  const contextActions = [
    {
      label: 'Back to Types',
      onClick: () => navigate('/ingredients/types'),
      primary: false
    },
    {
      label: 'View Recipes',
      onClick: () => navigate(`/recipes?typeId=${typeId}`),
      primary: true
    }
  ];
  
  return (
    <Box sx={{ p: 2 }}>
      <Breadcrumbs />
      
      <ContextBar 
        title={`Ingredients: ${typeDetails?.name || 'Loading...'}`}
        actions={contextActions}
      />
      
      <CrudLayout
        columnMap={columnMap}
        listEvent="ingrList"
        onRowSelection={handleRowSelection}
      />
    </Box>
  );
};

export default IngredientListPage;
