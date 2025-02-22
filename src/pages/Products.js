import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import CrudTemplate from '../components/crud/CrudTemplate';
import ProductsTabs from '../components/tabs/ProductsTabs'; // Import CrudProdTabs

const Products = ({ pageList }) => {
  const [selectedRows, setSelectedRows] = useState([null, null, null]); // State to store selected rows
  const [tabIndex, setTabIndex] = useState(0); // State to manage the active tab
  const [tabConfig, setTabConfig] = useState([]);

  useEffect(() => {
    const config = pageList.filter(page => page.page === 'products');
    setTabConfig(config);
  }, [pageList]);

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
      <ProductsTabs selectedRows={selectedRows} onTabChange={handleTabChange} />
      {tabConfig.map((config, index) => (
        tabIndex === config.tab && (
          <CrudTemplate
            key={config.pageID}
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

export default Products;
