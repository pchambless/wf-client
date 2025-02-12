import React, { useEffect, useState } from 'react';
import { useModalContext } from '../context/ModalContext';
import useLogger from '../hooks/useLogger';
import { useGlobalContext } from '../context/GlobalContext';
import { fetchData } from '../utils/dataFetcher';
import { Container, Typography, Button, Box, CircularProgress, Paper, TableContainer } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const Dashboard = () => {
  const pageTitle = 'Dashboard';
  const { openModal } = useModalContext();
  const log = useLogger('Dashboard');
  const { updatePageTitle } = useGlobalContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    log('Dashboard component mounted');
    updatePageTitle(pageTitle);
    fetchData('apiPageConfigList', '[]')
      .then((result) => {
        setData(result.map((item, index) => ({ id: index, ...item }))); // Ensure each row has a unique id
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [log, updatePageTitle, pageTitle]);

  const handleOpenTestModal = () => {
    log('Opening test modal');
    openModal('deleteConfirm');
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

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Button variant="contained" color="primary" onClick={handleOpenTestModal}>
          Open Test Modal
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          paginationMode="server" // Set pagination mode to server
          rowCount={data.length} // Provide row count
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
