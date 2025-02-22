import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ProductTabs from '../components/tabs/ProductTabs';
import CrudTemplate from '../components/crud/CrudTemplate';
import Container from './Container'; // Import Container

const Product = ({ tabConfigs = [] }) => {
  const [selectedRows, setSelectedRows] = useState([null, null, null]); // State to store selected rows
  const [tabIndex, setTabIndex] = useState(0); // State to manage the active tab
  const [tabConfig, setTabConfig] = useState([]);

  useEffect(() => {
    const config = tabConfigs.filter(config => config.pageName === 'Product');
    setTabConfig(config);
  }, [tabConfigs]); // Ensure the dependency array is correct

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
    <Container>
      <Box>
        <ProductTabs selectedRows={selectedRows} onTabChange={handleTabChange} />
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
    </Container>
  );
};

export default Product;
