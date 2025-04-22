import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Button, Typography } from '@mui/material';
import Container from '../Container';
import CrudLayout from '../../components/crud/CrudLayout';
import createLogger from '../../utils/logger';
import { pageConfig } from './config';
import SettingsIcon from '@mui/icons-material/Settings';
import IssueImporter from '../../admin/IssueImporter';
import GitHubSettings from '../../admin/GitHubSettings';
import { withMainLayout } from '../../layouts/MainLayout';

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
  const { pageName, tabConfig } = pageConfig;
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    log.debug('Admin page initialized', { pageName, tabCount: tabConfig.length });
  }, [pageName, tabConfig]);

  const handleTabChange = (event, newValue) => {
    log.debug('Tab changed', { newValue });
    setTabIndex(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3 
      }}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button 
          variant="outlined" 
          startIcon={<SettingsIcon />}
          onClick={() => setSettingsOpen(true)}
        >
          GitHub Settings
        </Button>
      </Box>
      
      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
        {tabConfig.map((tab, idx) => (
          <Tab
            key={tab.label}
            label={tab.label}
            id={`admin-tab-${idx}`}
          />
        ))}
      </Tabs>
      
      {tabConfig.map((tab, idx) => (
        <TabPanel value={tabIndex} index={idx} key={tab.label}>
          {tab.label === "GitHub Issues" ? (
            <IssueImporter />
          ) : (
            <CrudLayout 
              pageName={tab.pageName}
              columnMap={tab.columnMap}
              listEvent={tab.listEvent}
              onRowSelection={(item) => {
                log.debug('Row selected in Admin tab', { tab: tab.label, item });
                // Additional actions on row selection can be implemented here.
              }}
            />
          )}
        </TabPanel>
      ))}
      
      <GitHubSettings 
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </Container>
  );
};

export default withMainLayout(Admin);
