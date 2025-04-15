import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import CrudLayout from '../../components/crud/CrudLayout';
import Breadcrumbs from '../../components/navigation/Breadcrumbs'; // You'll need to create this
import { columnMap } from './columns';
import { execEvent } from '../../stores/eventStore';
import createLogger from '../../utils/logger';

const log = createLogger('IngredientTypeList');

const IngredientTypeListPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await execEvent('ingrTypeList');
        setData(result || []);
        log.debug('Loaded ingredient types:', result?.length);
      } catch (error) {
        log.error('Error loading ingredient types:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Navigate to ingredients page when a type is selected
  const handleRowSelection = (row) => {
    if (row?.ingrTypeID) {
      navigate(`/ingredients/types/${row.ingrTypeID}/ingredients`);
    }
  };
  
  return (
    <Box sx={{ p: 2 }}>
      {/* This is a placeholder - you'd create a proper breadcrumb component */}
      <div style={{ marginBottom: '16px' }}>
        Home &gt; Ingredients &gt; Types
      </div>
      
      <CrudLayout
        columnMap={columnMap.IngrTypes}
        listEvent="ingrTypeList"
        onRowSelection={handleRowSelection}
      />
    </Box>
  );
};

export default IngredientTypeListPage;
