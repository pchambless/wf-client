import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CrudLayout from '@crud/CrudLayout';
import columnMap from './columns';
import { setVars } from '@utils/externalStoreDel';
import createLogger from '@utils/logger';
import NavigationHeader from '../../../components/1-page/b-navigation/cc-PageHeader/NavigationHeader';
import { useBreadcrumbs } from '../../../contexts/BreadcrumbContext';

const log = createLogger('IngredientBatches');

const IngredientBatches = () => {
  const navigate = useNavigate();
  const { typeId, ingredientId } = useParams();
  const { navigateToCrumb, addEntityCrumb } = useBreadcrumbs();
  
  // Set the required parameter for ingrBtchList event
  useEffect(() => {
    if (ingredientId) {
      log.debug(`Setting :ingrID=${ingredientId} for batch list`);
      setVars(':ingrID', ingredientId);
    }
  }, [ingredientId]);
  
  // Back button handler
  const handleBack = () => {
    const path = `/ingredients/types/${typeId}/ingredients`;
    navigate(path);
    navigateToCrumb(path);
    log.debug('Navigated back to Ingredients list');
  };
  
  // Add batch selection to breadcrumbs if needed
  const handleBatchSelection = (batch) => {
    if (batch) {
      addEntityCrumb(
        batch,
        'ingredientBatch',
        `/ingredients/types/${typeId}/ingredients/${ingredientId}/batches/${batch.btchID}`
      );
    }
  };
  
  return (
    <>
      <NavigationHeader 
        title={`Batches for Ingredient #${ingredientId}`}
      />
      
      <Box sx={{ mb: 2 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          variant="outlined"
        >
          Back to Ingredients
        </Button>
      </Box>
      
      <CrudLayout
        columnMap={columnMap}
        listEvent="ingrBtchList"
        onRowSelection={handleBatchSelection}
      />
    </>
  );
};

export default IngredientBatches;
