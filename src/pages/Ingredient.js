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

const log = createLogger('Ingredient');

const Ingredient = () => {
  // State variables
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedRows, setSelectedRows] = useState([null, null, null]);
  const [tabConfig, setTabConfig] = useState([]);
  const [tabLabels, setTabLabels] = useState(['Ingredient Types', 'Ingredients', 'Batches']);
  const [visibleTabs, setVisibleTabs] = useState([true, false, false]);

  // Initialize page
  useEffect(() => {
    log('Initializing Ingredient page');
    // Set the current page
    setCurrentPage('Ingredient', { title: 'Ingredients' });
    
    // Initialize hierarchy and get tab config
    initPageWithHierarchy('Ingredient');
    const config = generateTabConfig('Ingredient');
    log('Generated tab config:', config);
    setTabConfig(config);
    
    // Set initial labels based on hierarchy config
    const hierarchy = getPageHierarchy('Ingredient');
    if (hierarchy && hierarchy.hierarchy) {
      setTabLabels(hierarchy.hierarchy.map(level => level.label));
    }
  }, []);

  // Update breadcrumbs when selections or tab change
  useEffect(() => {
    updateBreadcrumbsFromHierarchy('Ingredient', selectedRows, tabIndex);
  }, [selectedRows, tabIndex]);

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    log('Tab changed:', newValue);
    if (newValue === 0) {
      // Reset to initial tab state when first tab is selected
      setSelectedRows([null, null, null]);
      
      // Reset tab labels based on hierarchy config
      const hierarchy = getPageHierarchy('Ingredient');
      if (hierarchy && hierarchy.hierarchy) {
        setTabLabels(hierarchy.hierarchy.map(level => level.label));
      }
      
      setVisibleTabs([true, false, false]);
    }
    setTabIndex(newValue);
  };

  // Row selection handler
  const handleRowSelection = (level) => {
    log('Row selected at level:', level);
    
    const newSelectedRows = [...selectedRows];
    newSelectedRows[level] = true;
    setSelectedRows(newSelectedRows);

    // Get the hierarchy configuration
    const hierarchy = getPageHierarchy('Ingredient');
    if (!hierarchy || !hierarchy.hierarchy) return;

    if (level === 0) {
      const ingrTypeName = getVar(':ingrTypeName');
      log('ingrTypeName:', ingrTypeName);
      
      // Update tab labels
      const newLabels = [...tabLabels];
      newLabels[1] = `${hierarchy.hierarchy[1].label}: ${ingrTypeName}`;
      setTabLabels(newLabels);
      
      setVisibleTabs([true, true, false]);
    }

    if (level === 1) {
      const ingrName = getVar(':ingrName');
      log('ingrName:', ingrName);
      
      // Update tab labels
      const newLabels = [...tabLabels];
      newLabels[2] = `${hierarchy.hierarchy[2].label}: ${ingrName}`;
      setTabLabels(newLabels);
      
      setVisibleTabs([true, true, true]);
    }
  };

  // TabPanel component
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

  log('Rendering Ingredient component');
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
              pageName={config.pageName} // This should now be the correct page name from pageConfigs
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

export default Ingredient;
