import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, Tab } from '@mui/material';

const ProductTabs = ({ selectedRows, onTabChange }) => {
  const tabsConfig = useMemo(() => [
    {
      tab: 1,
      pageName: 'ProdTypes',
      tabTitle: 'Product Types',
      appLayout: 'Crud'
    },
    {
      tab: 2,
      pageName: 'Products',
      tabTitle: 'Products',
      appLayout: 'Crud'
    },
    {
      tab: 3,
      pageName: 'ProdBatches',
      tabTitle: 'Product Batches',
      appLayout: 'Crud'
    }
  ], []);

  const [visibleTabs, setVisibleTabs] = useState([tabsConfig[0]]); // Initially show the first tab

  useEffect(() => {
    const newVisibleTabs = [tabsConfig[0]]; // Always show the first tab
    if (selectedRows[0]) {
      newVisibleTabs.push(tabsConfig[1]); // Show the second tab if the first row is selected
    }
    if (selectedRows[1]) {
      newVisibleTabs.push(tabsConfig[2]); // Show the third tab if the second row is selected
    }
    setVisibleTabs(newVisibleTabs);
  }, [selectedRows, tabsConfig]);

  return (
    <Tabs value={visibleTabs.length - 1} onChange={onTabChange} aria-label="crud tabs">
      {visibleTabs.map((tab, index) => (
        <Tab key={index} label={tab.tabTitle} />
      ))}
    </Tabs>
  );
};

export default ProductTabs;
