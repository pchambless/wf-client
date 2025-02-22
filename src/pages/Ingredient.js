import React, { useState, useEffect, useMemo } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import CrudTemplate from '../components/crud/CrudTemplate';
import Container from './Container'; // Import Container
import useLogger from '../hooks/useLogger'; // Import useLogger

const defaultTabConfigs = [
  {
    tab: 0,
    pageName: 'IngrTypes',
    tabTitle: 'Ingredient Types',
    appLayout: 'Crud'
  },
  {
    tab: 1,
    pageName: 'Ingredients',
    tabTitle: 'Ingredients',
    appLayout: 'Crud'
  },
  {
    tab: 2,
    pageName: 'IngrBatches',
    tabTitle: 'Ingredient Batches',
    appLayout: 'Crud'
  }
];

const Ingredient = ({ tabConfigs = defaultTabConfigs }) => {
  const log = useLogger('Ingredient'); // Initialize logger
  const [selectedRows, setSelectedRows] = useState([null, null, null]); // State to store selected rows
  const [tabIndex, setTabIndex] = useState(0); // State to manage the active tab
  const [tabConfig, setTabConfig] = useState([]);

  const tabsConfig = useMemo(() => [
    {
      tab: 0,
      pageName: 'IngrTypes',
      tabTitle: 'Ingredient Types',
      appLayout: 'Crud'
    },
    {
      tab: 1,
      pageName: 'Ingredients',
      tabTitle: 'Ingredients',
      appLayout: 'Crud'
    },
    {
      tab: 2,
      pageName: 'IngrBatches',
      tabTitle: 'Ingredient Batches',
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
    setTabIndex(newValue);
  };

  const handleRowSelection = (level) => {
    log('Row selected at level:', level);
    const newSelectedRows = [...selectedRows];
    newSelectedRows[level] = true;
    setSelectedRows(newSelectedRows);
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

  log('Rendering Ingredient component');
  log('tabIndex:', tabIndex);
  log('tabConfig:', tabConfig);
  return (
    <Container>
      <Box>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="crud tabs">
          {tabsConfig.map((tab, index) => (
            <Tab key={index} label={tab.tabTitle} disabled={index > 0 && !selectedRows[index - 1]} />
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

export default Ingredient;
