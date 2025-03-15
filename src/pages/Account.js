import React, { useState, useEffect, useMemo } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import CrudTemplate from '../components/crud/CrudTemplate';
import Container from './Container'; // Import Container
import createLogger from '../utils/logger'; // Import createLogger

const log = createLogger('Account');

const defaultTabConfigs = [
  {
    tab: 0,
    pageName: 'Vendors',
    tabTitle: 'Vendors',
    appLayout: 'Crud'
  },
  {
    tab: 1,
    pageName: 'Brands',
    tabTitle: 'Brands',
    appLayout: 'Crud'
  },
  {
    tab: 2,
    pageName: 'Workers',
    tabTitle: 'Workers',
    appLayout: 'Crud'
  }
];

const Account = ({ tabConfigs = defaultTabConfigs }) => {
  const [tabIndex, setTabIndex] = useState(0); // State to manage the active tab
  const [tabConfig, setTabConfig] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const tabsConfig = useMemo(() => [
    {
      tab: 0,
      pageName: 'Vendors',
      tabTitle: 'Vendors',
      appLayout: 'Crud'
    },
    {
      tab: 1,
      pageName: 'Brands',
      tabTitle: 'Brands',
      appLayout: 'Crud'
    },
    {
      tab: 2,
      pageName: 'Workers',
      tabTitle: 'Workers',
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
  }, [tabConfigs]); // Ensure the dependency array is correct

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

  log('Rendering Account component');
  log('tabIndex:', tabIndex);
  log('tabConfig:', tabConfig);
  return (
    <Container>
      <Box>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="crud tabs">
          {tabsConfig.map((tab, index) => (
            <Tab 
              key={index} 
              label={tab.tabTitle} 
            />
          ))}
        </Tabs>
        {tabConfig.length > 0 && tabConfig.map((config, _index) => (
          <TabPanel value={tabIndex} index={_index} key={config.pageName}>
            <CrudTemplate
              pageName={config.pageName}
              tabIndex={tabIndex}
              onRowSelection={() => handleRowSelection(_index)}
              listEvent={config.listEvent}
              keyField={config.keyField}
            />
          </TabPanel>
        ))}
      </Box>
    </Container>
  );
};

export default Account;
