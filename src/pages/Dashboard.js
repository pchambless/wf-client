import React, { useEffect, useState } from 'react';
import { useModalContext } from '../context/ModalContext';
import useLogger from '../hooks/useLogger';
import { useGlobalContext } from '../context/GlobalContext';
import { Container, Typography, Button, Box, CircularProgress, Paper, TableContainer, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const Dashboard = () => {
  const pageTitle = 'Dashboard';
  const { openModal } = useModalContext();
  const log = useLogger('Dashboard');
  const { updatePageTitle, getPageConfig } = useGlobalContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    log('Dashboard component mounted');
    updatePageTitle(pageTitle);
    try {
      const pageConfigs = getPageConfig();
      if (!pageConfigs) {
        throw new Error(log('Page configs not found'));
      }
      const formattedData = pageConfigs.map((item, index) => ({ id: index, ...item })); // Ensure each row has a unique id
      setData(formattedData);
      setFilteredData(formattedData.filter(item => item.menu === selectedMenu));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [log, updatePageTitle, pageTitle, selectedMenu, getPageConfig]);

  const handleOpenTestModal = () => {
    log('Opening test modal');
    openModal('deleteConfirm');
  };

  const handleMenuChange = (event) => {
    setSelectedMenu(event.target.value);
    setFilteredData(data.filter(item => item.menu === event.target.value));
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error fetching data: {error}</Typography>;
  }

  const columns = [
    { field: 'pageName', headerName: 'Page Name', flex: 1 },
    { field: 'pageTitle', headerName: 'Page Title', flex: 1 },
    { field: 'dbTable', headerName: 'DB Table', flex: 1 },
    { field: 'listEvent', headerName: 'List Event', flex: 1 },
    { field: 'appLayout', headerName: 'App Layout', flex: 1 },
    { field: 'keyField', headerName: 'Key Field', flex: 1 },
  ];

  const menuOptions = [
    'dashboard',
    'admin',
    'account',
    'ingredients',
    'products',
    'batches',
    'login'
  ];

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Button variant="contained" color="primary" onClick={handleOpenTestModal}>
          Open Test Modal
        </Button>
      </Box>
      <Box mb={4}>
        <FormControl fullWidth>
          <InputLabel id="menu-select-label">Select Menu</InputLabel>
          <Select
            labelId="menu-select-label"
            id="menu-select"
            value={selectedMenu}
            label="Select Menu"
            onChange={handleMenuChange}
          >
            {menuOptions.map((menu) => (
              <MenuItem key={menu} value={menu}>
                {menu}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper} sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          paginationMode="server" // Set pagination mode to server
          rowCount={filteredData.length} // Provide row count
          disableSelectionOnClick
          density="compact" // Set density to compact
          sx={{
            '& .MuiDataGrid-cell': {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
          }}
        />
      </TableContainer>
    </Container>
  );
};

export default Dashboard;
