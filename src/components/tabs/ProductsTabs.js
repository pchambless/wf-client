import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, Tab } from '@mui/material';

const CrudProdTabs = ({ selectedRows, onTabChange }) => {
  const tabsConfig = useMemo(() => [
    { label: 'Product Types' },
    { label: 'Tasks' },
    { label: 'Products' },
    { label: 'Recipes' },
    { label: 'Batches' }
  ], []);

  const [visibleTabs, setVisibleTabs] = useState([tabsConfig[0]]); // Initially show the first tab

  useEffect(() => {
    const newVisibleTabs = [tabsConfig[0]]; // Always show the first tab
    if (selectedRows[0]) {
      newVisibleTabs.push(tabsConfig[1], tabsConfig[2]); // Show the second and third tabs if the first row is selected
    }
    if (selectedRows[2]) {
      newVisibleTabs.push(tabsConfig[3], tabsConfig[4]); // Show the fourth and fifth tabs if the third row is selected
    }
    setVisibleTabs(newVisibleTabs);
  }, [selectedRows, tabsConfig]); 

  return (
    <Tabs value={visibleTabs.length - 1} onChange={onTabChange} aria-label="crud tabs">
      {visibleTabs.map((tab, index) => (
        <Tab key={index} label={tab.label} />
      ))}
    </Tabs>
  );
};

export default CrudProdTabs;
