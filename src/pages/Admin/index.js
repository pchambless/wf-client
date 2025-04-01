import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import Container from '../Container';
import CrudLayout from '../../components/crud/CrudLayout';
import createLogger from '../../utils/logger';
import { pageConfig } from './config';

const log = createLogger('Admin');

// Render a TabPanel similar to what is done in other pages.
const TabPanel = ({ children, value, index, ...other }) => {
  log.debug('Rendering TabPanel', { value, index });
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
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

const Admin = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { pageName, tabConfiguration } = pageConfig;

  useEffect(() => {
    log.debug('Admin page initialized', { pageName, tabCount: tabConfiguration.length });
  }, [pageName, tabConfiguration]);

  const handleTabChange = (event, newValue) => {
    log.debug('Tab changed', { newValue });
    setTabIndex(newValue);
  };

  return (
    <Container>
      <Box>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="admin crud tabs"
        >
          {tabConfiguration.map((tab, idx) => (
            <Tab
              key={tab.label}
              label={tab.label}
              id={`admin-tab-${idx}`}
            />
          ))}
        </Tabs>
        {tabConfiguration.map((tab, idx) => (
          <TabPanel value={tabIndex} index={idx} key={tab.label}>
            <CrudLayout 
              pageName={tab.pageName}
              columnMap={tab.columnMap}
              listEvent={tab.listEvent}
              onRowSelection={(item) => {
                log.debug('Row selected in Admin tab', { tab: tab.label, item });
                // Additional actions on row selection can be implemented here.
              }}
            />
          </TabPanel>
        ))}
      </Box>
    </Container>
  );
};

export default Admin;
