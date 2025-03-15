import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import CrudTemplate from '../components/crud/CrudTemplate';
import Container from './Container';
import createLogger from '../utils/logger';
import { getVar } from '../utils/externalStore';
import { setCurrentPage } from '../stores';
import { 
  getPageHierarchy, 
  initPageWithHierarchy, 
  updateBreadcrumbsFromHierarchy,
  generateTabConfig
} from '../stores/hierarchyStore';

const log = createLogger('Product');

const Product = () => {
  const [selectedRows, setSelectedRows] = useState([null, null, null]);
  const [tabIndex, setTabIndex] = useState(0);
  const [tabConfig, setTabConfig] = useState([]);
  const [tabLabels, setTabLabels] = useState(['Product Types', 'Products', 'Batches']);
  const [visibleTabs, setVisibleTabs] = useState([true, false, false]);

  // Initialize page with hierarchy
  useEffect(() => {
    log('Initializing Product page');
    // Set the current page
    setCurrentPage('Product', { title: 'Products' });
    
    // Initialize hierarchy and get tab config
    initPageWithHierarchy('Product');
    const config = generateTabConfig('Product');
    log('Generated tab config:', config);
    
    if (config.length === 0) {
      log('WARNING: Empty tab configuration generated!');
    } else {
      log('Tab config pageName values:', config.map(c => c.pageName));
      log('Tab config listEvent values:', config.map(c => c.listEvent));
      log('Tab config keyField values:', config.map(c => c.keyField));
    }
    
    setTabConfig(config);
    
    // Set initial labels based on hierarchy config
    const hierarchy = getPageHierarchy('Product');
    log('Hierarchy:', hierarchy);
    
    if (hierarchy && hierarchy.hierarchy) {
      setTabLabels(hierarchy.hierarchy.map(level => level.label));
    }
  }, []);

  // Update breadcrumbs when selections or tab change
  useEffect(() => {
    updateBreadcrumbsFromHierarchy('Product', selectedRows, tabIndex);
  }, [selectedRows, tabIndex]);

  const handleTabChange = (event, newValue) => {
    log('Tab changed:', newValue);
    if (newValue === 0) {
      // Reset to initial tab state when tab 0 is selected
      setSelectedRows([null, null, null]);
      
      // Reset tab labels based on hierarchy config
      const hierarchy = getPageHierarchy('Product');
      if (hierarchy && hierarchy.hierarchy) {
        setTabLabels(hierarchy.hierarchy.map(level => level.label));
      }
      
      setVisibleTabs([true, false, false]);
    }
    setTabIndex(newValue);
  };

  const handleRowSelection = (level) => {
    log('Row selected at level:', level);
    
    const newSelectedRows = [...selectedRows];
    newSelectedRows[level] = true;
    setSelectedRows(newSelectedRows);

    // Get the hierarchy configuration
    const hierarchy = getPageHierarchy('Product');
    if (!hierarchy || !hierarchy.hierarchy) return;

    if (level === 0) {
      const prodTypeName = getVar(':prodTypeName');
      log('prodTypeName:', prodTypeName);
      setTabLabels(prevLabels => [
        prevLabels[0],
        `Products: ${prodTypeName}`,
        prevLabels[2]
      ]);
      setVisibleTabs([true, true, false]);
    }

    if (level === 1) {
      const prodName = getVar(':prodName');
      log('prodName:', prodName);
      setTabLabels(prevLabels => [
        prevLabels[0],
        prevLabels[1],
        `Batches: ${prodName}`
      ]);
      setVisibleTabs([true, true, true]);
    }

    log('After update - selectedRows:', newSelectedRows);
    log('After update - visibleTabs:', visibleTabs);
    log('After update - tabIndex:', tabIndex);
  };

  const TabPanel = ({ children, value, index, ...other }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            {children}
          </Box>
        )}
      </div>
    );
  };

  log('Rendering Product component');
  log('tabIndex:', tabIndex);
  log('tabConfig:', tabConfig);
  log('tabLabels:', tabLabels);
  
  return (
    <Container>
      <Box>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="crud tabs">
          {tabConfig.map((config, index) => (
            <Tab 
              key={index} 
              label={tabLabels[index]} 
              disabled={!visibleTabs[index]} 
            />
          ))}
        </Tabs>
        {tabConfig.length > 0 && tabConfig.map((config, index) => (
          <TabPanel value={tabIndex} index={index} key={index}>
            <CrudTemplate
              pageName={config.pageName}
              tabIndex={tabIndex}
              onRowSelection={() => handleRowSelection(index)}
              listEvent={config.listEvent} // Updated from selList to listEvent
              keyField={config.keyField}
            />
          </TabPanel>
        ))}
      </Box>
    </Container>
  );
};

export default Product;
