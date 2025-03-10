import React, { useState, useEffect, useMemo } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import CrudTemplate from '../components/crud/CrudTemplate';
import Container from './Container';
import createLogger from '../utils/logger';
import { getVar } from '../utils/externalStore';

const log = createLogger('Ingredient');

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
    tabTitle: 'Batches',
    appLayout: 'Crud'
  }
];

const Ingredient = ({ tabConfigs = defaultTabConfigs }) => {
  const [selectedRows, setSelectedRows] = useState([null, null, null]);
  const [tabIndex, setTabIndex] = useState(0);
  const [tabConfig, setTabConfig] = useState([]);
  const [tabLabels, setTabLabels] = useState(['Ingredient Types', 'Ingredients', 'Batches']);
  const [visibleTabs, setVisibleTabs] = useState([true, false, false]);

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
  }, [tabConfigs]);

  const handleTabChange = (event, newValue) => {
    log('Tab changed:', newValue);
    if (newValue === 0) {
      // Reset to initial tab state when tab 0 is selected
      setSelectedRows([null, null, null]);
      setTabLabels(['Ingredient Types', 'Ingredients', 'Batches']);
      setVisibleTabs([true, false, false]);
    }
    setTabIndex(newValue);
  };

  const handleRowSelection = (level) => {
    log('Row selected at level:', level);
    log('Before update - selectedRows:', selectedRows);
    log('Before update - visibleTabs:', visibleTabs);
    log('Before update - tabIndex:', tabIndex);

    const newSelectedRows = [...selectedRows];
    newSelectedRows[level] = true;
    setSelectedRows(newSelectedRows);

    if (level === 0) {
      const ingrTypeName = getVar(':ingrTypeName');
      log('ingrTypeName:', ingrTypeName);
      setTabLabels(prevLabels => [
        prevLabels[0],
        `Ingredients: ${ingrTypeName}`,
        prevLabels[2]
      ]);
      setVisibleTabs([true, true, false]);
      // We don't change the tab index here
    }

    if (level === 1) {
      const ingrName = getVar(':ingrName');
      log('ingrName:', ingrName);
      setTabLabels(prevLabels => [
        prevLabels[0],
        prevLabels[1],
        `Batches: ${ingrName}`
      ]);
      setVisibleTabs([true, true, true]);
      // We don't change the tab index here
    }
    
    log('After update - selectedRows:', newSelectedRows);
    log('After update - visibleTabs:', level === 0 ? [true, true, false] : [true, true, true]);
    log('After update - tabIndex remains:', tabIndex);
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

  log('Rendering Ingredient component');
  log('tabIndex:', tabIndex);
  log('tabConfig:', tabConfig);
  log('tabLabels:', tabLabels);
  log('visibleTabs:', visibleTabs);
  return (
    <Container>
      <Box>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="crud tabs">
          {tabsConfig.map((tab, index) => (
            visibleTabs[index] && (
              <Tab 
                key={index} 
                label={tabLabels[index]} 
                disabled={index > 0 && !selectedRows[index - 1]}
              />
            )
          ))}
        </Tabs>
        {tabConfig.length > 0 && tabConfig.map((config, index) => (
          <TabPanel value={tabIndex} index={config.tab} key={config.tab}>
            <CrudTemplate
              pageName={config.pageName}
              tabIndex={tabIndex}
              // Pass setTabIndex to allow CrudTemplate to control tabs if needed in the future
              setTabIndex={setTabIndex}
              // This is key: we pass our handler for row selection but don't change tabs
              onRowSelection={() => handleRowSelection(config.tab)}
            />
          </TabPanel>
        ))}
      </Box>
    </Container>
  );
};

export default Ingredient;
