import React, { useState, Suspense } from 'react';
import Container from './Container';
import { Tabs, Tab, CircularProgress } from '@mui/material';
import MetricsTable from '../actions/tracker/components/MetricsTable';
import TrackerTable from '../actions/tracker/components/TrackerTable';

const Welcome = () => {
  const [activeTab, setActiveTab] = useState('metrics');

  return (
    <Container>
      <Tabs value={activeTab} onChange={(e, tab) => setActiveTab(tab)}>
        <Tab label="Metrics" value="metrics" />
        <Tab label="Last Action" value="action" />
      </Tabs>

      <Suspense fallback={<CircularProgress />}>
        {activeTab === 'metrics' ? (
          <MetricsTable />
        ) : (
          <TrackerTable />
        )}
      </Suspense>
    </Container>
  );
};

export default Welcome;
