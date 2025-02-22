import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import IngredientsTabs from '../components/tabs/IngredientsTabs';
import CrudTemplate from '../components/crud/CrudTemplate';

const Ingredients = ({ tabConfigs = [] }) => {
  const [selectedRows, setSelectedRows] = useState([null, null, null]); // State to store selected rows
  const [tabIndex, setTabIndex] = useState(0); // State to manage the active tab
  const [tabConfig, setTabConfig] = useState([]);

  useEffect(() => {
    const config = tabConfigs.filter(config => config.pageName === 'Ingredients');
    setTabConfig(config);
  }, [tabConfigs]);

  const handleRowClick = (row, level) => {
    const newSelectedRows = [...selectedRows];
    newSelectedRows[level] = row;
    setSelectedRows(newSelectedRows);
    setTabIndex(level + 1);
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box>
      <IngredientsTabs selectedRows={selectedRows} onTabChange={handleTabChange} />
      {tabConfig.map((config, index) => (
        tabIndex === config.tab && (
          <CrudTemplate
            key={config.tab}
            pageConfig={config}
            selectedRows={selectedRows}
            handleRowClick={handleRowClick}
            tabIndex={tabIndex}
          />
        )
      ))}
    </Box>
  );
};

export default Ingredients;
