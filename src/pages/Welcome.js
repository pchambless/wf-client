import React, { useState, Suspense } from 'react';
import Container from '../layouts/Container';
import { Tabs, Tab, CircularProgress, Grid, Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import MetricsTable from '../actions/tracker/components/MetricsTable';
import TrackerTable from '../actions/tracker/components/TrackerTable';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const [activeTab, setActiveTab] = useState('metrics');
  const navigate = useNavigate();

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

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="div">
              GitHub Issues
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Import GitHub issues as requirement documents
            </Typography>
          </CardContent>
          <CardActions>
            <Button 
              size="small" 
              onClick={() => navigate('/admin/issues')}
              startIcon={<GitHubIcon />}
            >
              Manage Issues
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Container>
  );
};

export default Welcome;
