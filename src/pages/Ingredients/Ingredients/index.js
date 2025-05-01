import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CrudLayout from '../../../layouts/CrudLayout';
import columnMap from './columns';
import { setVar } from '../../../utils/externalStore';
import createLogger from '../../../utils/logger';
import NavigationHeader from '../../../components/navigation/NavigationHeader';
import { useBreadcrumbs } from '../../../contexts/BreadcrumbContext';

const log = createLogger('Ingredients Page');

const Ingredients = ({ typeDetails: propTypeDetails }) => {
  const navigate = useNavigate();
  const { typeId } = useParams();
  const [typeDetails, setTypeDetails] = useState(propTypeDetails || null);
  
  // Move hook call to top level of component
  const { addCrumb, navigateToCrumb, addEntityCrumb } = useBreadcrumbs();
  
  // Set param for data loading and update breadcrumbs
  useEffect(() => {
    if (!typeId) return;
    
    setVar(':ingrTypeID', typeId);
    
    // If we already have the type details from props, use them
    if (propTypeDetails) {
      setTypeDetails(propTypeDetails);
      
      // Update breadcrumbs with the type details
      addCrumb({
        label: propTypeDetails.name || propTypeDetails.ingrTypeName || `Type ${typeId}`,
        path: `/ingredients/types/${typeId}/ingredients`
      });
    }
  }, [typeId, propTypeDetails, addCrumb]);
  
  // Update breadcrumbs based on typeDetails
  useEffect(() => {
    if (typeDetails) {
      addEntityCrumb(
        typeDetails, 
        'ingredientType', 
        `/ingredients/types/${typeId}/ingredients`
      );
    }
  }, [typeDetails, typeId, addEntityCrumb]);
  
  // Navigate to batches page
  const handleRowSelection = (row) => {
    if (row?.ingrID) {
      // Add entity crumb before navigation
      addEntityCrumb(
        row, 
        'ingredient', 
        `/ingredients/types/${typeId}/ingredients/${row.ingrID}/batches`
      );
      
      // Then navigate
      navigate(`/ingredients/types/${typeId}/ingredients/${row.ingrID}/batches`);
    }
  };
  
  // Back button handler - now uses navigateToCrumb from the component scope
  const handleBack = () => {
    // Navigate back to ingredient types page
    navigate('/ingredients/types');
    
    // Update breadcrumbs - navigate to the Types crumb which truncates the trail
    navigateToCrumb('/ingredients/types');
    
    log.debug('Navigated back to Ingredient Types, breadcrumb trail truncated');
  };
  
  return (
    <>
      <NavigationHeader 
        title={`Ingredients: ${typeDetails?.name || typeDetails?.ingrTypeName || '...'}`}
      />
      
      <Box sx={{ mb: 2 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          variant="outlined"
        >
          Back to Types
        </Button>
      </Box>
      
      <CrudLayout
        columnMap={columnMap}
        listEvent="ingrList"
        onRowSelection={handleRowSelection}
      />
    </>
  );
};

export default Ingredients;
