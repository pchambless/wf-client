import React, { useState, useEffect, useMemo } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import CrudTemplate from '../components/crud/CrudTemplate';
import Container from './Container'; // Import Container
import useLogger from '../hooks/useLogger'; // Import useLogger
import { getVar } from '../utils/externalStore'; // Import getVar

const defaultTabConfigs = [
  {
    tab: 0,
    pageName: 'ProdTypes',
    tabTitle: 'Product Types',
    appLayout: 'Crud'
  },
  {
    tab: 1,
    pageName: 'Products',
    tabTitle: 'Products',
    appLayout: 'Crud'
  },
  {
    tab: 2,
    pageName: 'ProdBatches',
    tabTitle: 'Batches',
    appLayout: 'Crud'
  }
];

const Product = ({ tabConfigs = defaultTabConfigs }) => {
  const log = useLogger('Product'); // Initialize logger
  const [selectedRows, setSelectedRows] = useState([null, null, null]); // State to store selected rows
  const [tabIndex, setTabIndex] = useState(0); // State to manage the active tab
  const [tabConfig, setTabConfig] = useState([]);
  const [tabLabels, setTabLabels] = useState(['Product Types', 'Products', 'Batches']); // State to manage tab labels

  const tabsConfig = useMemo(() => [
    {
      tab: 0,
      pageName: 'ProdTypes',
      tabTitle: 'Product Types',
      appLayout: 'Crud'
    },
    {
      tab: 1,
      pageName: 'Products',
      tabTitle: 'Products',
      appLayout: 'Crud'
    },
    {
      tab: 2,
      pageName: 'ProdBatches',
      tabTitle: 'Batches',
      appLayout: 'Crud'
    }
  ], []);

  useEffect(() => {
    log('useEffect triggered');
    log('tabConfigs:', tabConfigs);
    const config = tabConfigs.filter(config => config.tab === 0 || config.tab === 1 || config.tab === 2);
    log('Filtered config:', config);
    setTabConfig(prevConfig => {
      if (JSON.stringify(prevConfig) !== JSON.stringify(config)) {
        log('tabConfig updated:', config);
        return config;
      }
      return prevConfig;
    });
  }, [tabConfigs, log]); // Ensure the dependency array is correct

  const handleRowClick = (row, level) => {
    log('Row clicked:', row, 'Level:', level);
    const newSelectedRows = [...selectedRows];
    newSelectedRows[level] = row;
    setSelectedRows(newSelectedRows);
    setTabIndex(level + 1);
  };

  const handleTabChange = (event, newValue) => {
    log('Tab changed:', newValue);
    if (newValue === 0) {
      // Reset to initial tab state when tab 0 is selected
      setSelectedRows([null, null, null]);
      setTabLabels(['Product Types', 'Products', 'Batches']);
    }
    setTabIndex(newValue);
  };

  const handleRowSelection = (level) => {
    log('Row selected at level:', level);
    const newSelectedRows = [...selectedRows];
    newSelectedRows[level] = true;
    setSelectedRows(newSelectedRows);

    if (level === 0) {
      const prodTypeName = getVar(':prodTypeName');
      log('prodTypeName:', prodTypeName);
      setTabLabels(prevLabels => [
        prevLabels[0],
        `Products: ${prodTypeName}`,
        prevLabels[2]
      ]);
    }

    if (level === 1) {
      const prodName = getVar(':prodName');
      log('prodName:', prodName);
      setTabLabels(prevLabels => [
        prevLabels[0],
        prevLabels[1],
        `Batches: ${prodName}`
      ]);
    }
  };

  const TabPanel = ({ children, value, index, ...other }) => {
    log('Rendering TabPanel:', { value, index });
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
          {tabsConfig.map((tab, index) => (
            <Tab 
              key={index} 
              label={tabLabels[index]} 
              disabled={index > 0 && !selectedRows[index - 1]} // Disable tabs 1 and 2 based on selectedRows
            />
          ))}
        </Tabs>
        {tabConfig.length > 0 && tabConfig.map((config, index) => (
          <TabPanel value={tabIndex} index={config.tab} key={config.tab}>
            <CrudTemplate
              pageName={config.pageName}
              selectedRows={selectedRows}
              handleRowClick={handleRowClick}
              tabIndex={tabIndex}
              onRowSelection={() => handleRowSelection(config.tab)}
            />
          </TabPanel>
        ))}
      </Box>
    </Container>
  );
};

export default Product;
