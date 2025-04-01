import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import Container from '../Container';
import createLogger from '../../utils/logger';
import { accountConfig } from './config';
import TabbedCrumbs from '../BreadCrumbs/TabbedCrumbs';
import CrudLayout from '../../components/crud/CrudLayout';

const log = createLogger('Account');

const Account = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedRows, setSelectedRows] = useState({});

  useEffect(() => {
    log.debug('Initializing Account page', {
      config: accountConfig,
      tabCount: accountConfig.tabs.length
    });
  }, []);

  const handleTabChange = (event, newValue) => {
    log.debug('Tab changed:', { newValue });
    setTabIndex(newValue);
  };

  const handleRowSelection = (row, index) => {
    log.debug('Row selected', { index, row });
    setSelectedRows(prev => ({
      ...prev,
      [index]: row
    }));
  };

  const currentTab = accountConfig.tabs[tabIndex];
  const selectedRow = selectedRows[tabIndex];

  return (
    <Container>
      <TabbedCrumbs 
        tabName={currentTab.label} 
        selectedValue={selectedRow?.[currentTab.displayField]} 
      />
      <Box>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="crud tabs">
          {accountConfig.tabs.map((tab) => (
            <Tab 
              key={tab.pageName} 
              label={tab.label} 
            />
          ))}
        </Tabs>
        {accountConfig.tabs.map((tab, index) => (
          tabIndex === index && (
            <Box key={tab.pageName} role="tabpanel">
              <CrudLayout
                pageName={tab.pageName}
                listEvent={tab.listEvent}
                keyField={tab.keyField}
                onRowSelection={(row) => handleRowSelection(row, index)}
              />
            </Box>
          )
        ))}
      </Box>
    </Container>
  );
};

export default Account;
