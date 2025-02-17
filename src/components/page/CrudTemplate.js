import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Box, Grid, Typography, Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress } from '@mui/material';
import useLogger from '../../hooks/useLogger';
import { setVars } from '../../utils/externalStore';
import { useEventTypeContext } from '../../context/EventTypeContext';
import { useGlobalContext } from '../../context/GlobalContext';
import DynaForm from './DynaForm'; // Import DynamicForm

const CrudTemplate = React.memo(({ pageConfig, children }) => {
  const log = useLogger('CrudTemplate');
  const { updatePageTitle, selectedAccount } = useGlobalContext();
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [formMode, setFormMode] = useState('add');
  const [loading, setLoading] = useState(true);
  const { execEvent } = useEventTypeContext();
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  log('PageConfig:', pageConfig);

  useEffect(() => {
    if (pageConfig.pageTitle) {
      updatePageTitle(pageConfig.pageTitle);
    }
  }, [pageConfig.pageTitle, updatePageTitle]);

  const {
    listEvent,
    keyField,
    columnMap = [],
  } = pageConfig || {};

  log('listEvent:', listEvent);
  log('columnMap:', columnMap);

  const fetchDataCallback = useCallback(async () => {
    if (!listEvent || !selectedAccount) {
      log('No listEvent or selectedAccount provided, skipping data fetch');
      return;
    }
    try {
      log('Fetching data...');
      setLoading(true);
      const result = await execEvent(listEvent, { ':acctID': selectedAccount });
      log('Data fetched:', result);
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      log('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [listEvent, execEvent, log, selectedAccount]);

  useEffect(() => {
    log('useEffect triggered');
    fetchDataCallback();
  }, [fetchDataCallback, log, pageConfig, selectedAccount]);

  const handleRowClick = useCallback((row) => {
    log('Row clicked:', row);
    setFormData(row);
    setFormMode('edit');
    setSelectedRow(row[keyField]);

    columnMap.forEach(column => {
      if (column.setVar) {
        setVars({ [column.setVar]: row[column.field] });
      }
    });
  }, [columnMap, keyField, log]);

  const handleFormModeChange = useCallback((mode) => {
    setFormMode(mode);
    if (mode === 'add') {
      setFormData({});
      setSelectedRow(null);
    }
  }, []);

  const handleFormSubmit = useCallback(async (formData) => {
    // Handle form submission logic here
    log('Form submitted:', formData);
  }, [log]);

  const shouldRenderTable = useMemo(() => !!listEvent, [listEvent]);
  const shouldRenderForm = useMemo(() => formMode === 'edit' || formMode === 'add', [formMode]);

  log('Rendering Table:', shouldRenderTable);
  log('Rendering Form:', shouldRenderForm);

  if (loading) {
    log('Rendering loading state');
    return <CircularProgress />;
  }

  if (error) {
    log('Rendering error state:', error);
    return <Typography color="error">Error fetching data: {error}</Typography>;
  }

  if (!data || data.length === 0) {
    log('Rendering empty data state');
    return <Typography>No data available.</Typography>;
  }

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Grid container spacing={2}>
        {shouldRenderTable && (
          <Grid item xs={12} md={6}>
            <Box p={2} borderRadius={2} bgcolor="background.paper" boxShadow={3} height="100%">
              <Button onClick={() => handleFormModeChange('add')} variant="contained" color="primary" style={{ marginBottom: '16px' }}>
                Add New
              </Button>
              <TableContainer component={Paper} style={{ maxHeight: '400px', overflow: 'auto' }}>
                <MuiTable size="small" stickyHeader> {/* Compact vertical layout */}
                  <TableHead>
                    <TableRow>
                      {columnMap.filter(column => column.label).map((column) => ( // Filter out columns with empty labels
                        <TableCell key={column.field} style={column.style} className={column.hidden ? 'hidden' : ''}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow
                        key={row.id || index}
                        onClick={() => handleRowClick(row)}
                        className="cursor-pointer"
                        selected={selectedRow === row[keyField]}
                        style={{ cursor: 'pointer' }}
                      >
                        {columnMap.filter(column => column.label).map((column) => ( // Filter out columns with empty labels
                          <TableCell key={`${row[keyField] || index}-${column.field}`} style={column.style} className={column.hidden ? 'hidden' : ''}>
                            {row[column.field]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </MuiTable>
              </TableContainer>
            </Box>
          </Grid>
        )}
        {shouldRenderForm && (
          <Grid item xs={12} md={6}>
            <Box p={2} borderRadius={2} bgcolor="background.paper" boxShadow={3} height="100%">
              <DynaForm pageConfig={columnMap} formData={formData} setFormData={setFormData} /> {/* Use DynamicForm */}
              <Button onClick={() => handleFormSubmit(formData)} variant="contained" color="primary" disabled={formMode === 'view'}>
                {formMode === 'add' ? 'Add' : 'Update'}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
      {children && (
        <Box mt={2}>
          {children}
        </Box>
      )}
    </Box>
  );
});

export default CrudTemplate;