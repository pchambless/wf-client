import React, { useEffect, useState, useMemo } from 'react';
import { useModalContext } from '../context/ModalContext';
import useLogger from '../hooks/useLogger';
import { useGlobalContext } from '../context/GlobalContext';
import { Container, Typography, Button, Box, CircularProgress, Paper, TableContainer, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const Dashboard = () => {
  const pageTitle = 'Dashboard';
  const log = useLogger('Dashboard');
  const { openModal } = useModalContext();
  const { updatePageTitle, getPageConfig } = useGlobalContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [filteredData, setFilteredData] = useState([]);

  // Component lifecycle logging
  useEffect(() => {
    log.debug('Dashboard component mounted');
    return () => log.debug('Dashboard component unmounting');
  }, [log]);

  // Data fetching and initialization
  useEffect(() => {
    const initializeDashboard = async () => {
      const endTimer = log.startPerformanceTimer('dashboardInitialization');
      log.info('Initializing dashboard', { pageTitle });
      updatePageTitle(pageTitle);

      try {
        const pageConfigs = getPageConfig();
        if (!pageConfigs || !Array.isArray(pageConfigs) || pageConfigs.length === 0) {
          log.warn('No page configurations found, redirecting to login');
          setError('Please log in to view the dashboard');
          setLoading(false);
          return;
        }

        log.debug('Processing page configurations', { 
          configCount: pageConfigs.length,
          selectedMenu 
        });

        const formattedData = pageConfigs.map((item, index) => ({ 
          id: index, 
          ...item 
        }));

        setData(formattedData);
        setFilteredData(formattedData.filter(item => item.menu === selectedMenu));
        setLoading(false);
        endTimer();

      } catch (err) {
        log.error('Dashboard initialization failed', { 
          error: err.message,
          stack: err.stack
        });
        setError(err.message || 'Failed to initialize dashboard');
        setLoading(false);
        endTimer();
      }
    };

    initializeDashboard();
  }, [log, updatePageTitle, pageTitle, selectedMenu, getPageConfig]);

  const handleOpenTestModal = () => {
    log.debug('Opening test modal');
    openModal('deleteConfirm');
  };

  const handleMenuChange = (event) => {
    const newMenu = event.target.value;
    log.info('Menu selection changed', { 
      previousMenu: selectedMenu,
      newMenu,
      availableItems: data.filter(item => item.menu === newMenu).length
    });
    setSelectedMenu(newMenu);
    setFilteredData(data.filter(item => item.menu === newMenu));
  };

  // Memoized grid columns
  const columns = useMemo(() => [
    { field: 'menu', headerName: 'Menu', flex: 1 },
    { field: 'pageTitle', headerName: 'Page Title', flex: 2 },
    { field: 'description', headerName: 'Description', flex: 3 }
  ], []);

  if (loading) {
    log.debug('Rendering loading state');
    return <CircularProgress />;
  }

  if (error) {
    log.warn('Rendering error state', { error });
    return <Typography color="error">Error fetching data: {error}</Typography>;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard Overview
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Menu Filter</InputLabel>
          <Select value={selectedMenu} onChange={handleMenuChange}>
            <MenuItem value="dashboard">Dashboard</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="reports">Reports</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          onRowClick={(params) => {
            log.debug('Grid row clicked', { 
              rowId: params.id,
              rowData: params.row 
            });
          }}
        />
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Button variant="contained" onClick={handleOpenTestModal}>
          Test Modal
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
