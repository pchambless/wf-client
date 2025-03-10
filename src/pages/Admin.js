import React, { useState, useEffect, useMemo } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import CrudTemplate from '../components/crud/CrudTemplate';
import Container from './Container'; // Import Container
import createLogger from '../utils/logger'; // Import createLogger

const log = createLogger('Admin');

const defaultTabConfigs = [
  {
    tab: 0,
    pageName: 'Accounts',
    tabTitle: 'Accounts',
    appLayout: 'Crud'
  },
  {
    tab: 1,
    pageName: 'Users',
    tabTitle: 'Users',
    appLayout: 'Crud'
  },
  {
    tab: 2,
    pageName: 'MeasUnits',
    tabTitle: 'MeasUnits',
    appLayout: 'Crud'
  },
  {
    tab: 3,
    pageName: 'wfPages',
    tabTitle: 'WF Pages',
    appLayout: 'Crud'
  }
];

const Admin = ({ tabConfigs = defaultTabConfigs }) => {
  const [tabIndex, setTabIndex] = useState(0); // State to manage the active tab
  const [tabConfig, setTabConfig] = useState([]);

  const tabsConfig = useMemo(() => [
    {
      tab: 0,
      pageName: 'Accounts',
      tabTitle: 'Accounts',
      appLayout: 'Crud'
    },
    {
      tab: 1,
      pageName: 'Users',
      tabTitle: 'Users',
      appLayout: 'Crud'
    },
    {
      tab: 2,
      pageName: 'MeasUnits',
      tabTitle: 'MeasUnits',
      appLayout: 'Crud'
    },
    {
      tab: 3,
      pageName: 'wfPages',
      tabTitle: 'WF Pages',
      appLayout: 'Crud'
    }
  ], []);

  useEffect(() => {
    log('useEffect triggered');
    log('tabConfigs:', tabConfigs);
    const config = tabConfigs.filter(config => config.tab === 0 || config.tab === 1 || config.tab === 2 || config.tab === 3);
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

  log('Rendering Admin component');
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
        {tabConfig.length > 0 && tabConfig.map((config, index) => (
          <TabPanel value={tabIndex} index={config.tab} key={config.tab}>
            <CrudTemplate
              pageName={config.pageName}
              tabIndex={tabIndex}
            />
          </TabPanel>
        ))}
      </Box>
    </Container>
  );
};

export default Admin;
