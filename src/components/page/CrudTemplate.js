import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Box, Grid, Typography, Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, TextField } from '@mui/material';
import useLogger from '../../hooks/useLogger';
import { setVars } from '../../utils/externalStore';
import { fetchData } from '../../utils/dataFetcher';
import { useGlobalContext } from '../../context/GlobalContext';

const CrudTemplate = React.memo(({ pageConfig, children }) => {
  const log = useLogger('CrudTemplate');
  const { updatePageTitle, getEventType } = useGlobalContext();
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [formMode, setFormMode] = useState('add');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetchedData = useRef(false);

  log('PageConfig:', pageConfig);

  useEffect(() => {
    if (pageConfig.pageTitle) {
      updatePageTitle(pageConfig.pageTitle);
    }
  }, [pageConfig.pageTitle, updatePageTitle]);

  const {
    listEvent,
    keyField,
    columns = [],
  } = pageConfig || {};

  log('listEvent:', listEvent);
  log('columns:', columns);

  const fetchDataCallback = useCallback(async () => {
    if (!listEvent) {
      log('No listEvent provided, skipping data fetch');
      return;
    }
    try {
      log('Fetching data...');
      setLoading(true);
      const eventType = getEventType(listEvent);
      const params = eventType ? eventType.params : {};
      const result = await fetchData(listEvent, params);
      log('Data fetched:', result);
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      log('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [listEvent, getEventType, log]);

  useEffect(() => {
    log('useEffect triggered');
    if (!hasFetchedData.current) {
      log('Initiating data fetch');
      fetchDataCallback();
      hasFetchedData.current = true;
    }
  }, [fetchDataCallback, log]);

  const handleRowClick = useCallback((row) => {
    log('Row clicked:', row);
    setFormData(row);
    setFormMode('edit');

    columns.forEach(column => {
      if (column.setVar) {
        setVars({ [column.setVar]: row[column.field] });
      }
    });
  }, [columns, log]);

  const handleFormModeChange = useCallback((mode) => {
    setFormMode(mode);
    if (mode === 'add') {
      setFormData({});
    }
  }, []);

  const handleFormSubmit = useCallback(async (formData) => {
    // Handle form submission logic here
    log('Form submitted:', formData);
  }, [log]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    const column = columns.find(col => col.field === name);
    if (column && column.setVar) {
      setVars(column.setVar, value);
    }
  }, [columns]);

  const shouldRenderTable = useMemo(() => !!listEvent, [listEvent]);
  const shouldRenderForm = useMemo(() => !!(pageConfig.editEvent || pageConfig.addEvent), [pageConfig.editEvent, pageConfig.addEvent]);

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
    <Box display="flex" flexDirection="column" height="100%">
      <Grid container spacing={2}>
        {shouldRenderTable && (
          <Grid item xs={12} md={6}>
            <Box p={2} borderRadius={2} bgcolor="background.paper" boxShadow={3}>
              <TableContainer component={Paper}>
                <MuiTable>
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell key={column.field} style={column.style} className={column.hidden ? 'hidden' : ''}>
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={row.id || index} onClick={() => handleRowClick(row)} className="cursor-pointer">
                        {columns.map((column) => (
                          <TableCell key={`${row[keyField] || index}-${column.field}`} style={column.style} className={column.hidden ? 'hidden' : ''}>
                            {row[column.field]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </MuiTable>
                <Button onClick={() => handleFormModeChange('add')} variant="contained" color="primary" style={{ marginTop: '16px' }}>
                  Add New
                </Button>
              </TableContainer>
            </Box>
          </Grid>
        )}
        {shouldRenderForm && (
          <Grid item xs={12} md={6}>
            <Box p={2} borderRadius={2} bgcolor="background.paper" boxShadow={3}>
              <form onSubmit={handleFormSubmit}>
                {columns.map((column) => (
                  !column.hidden && (
                    <TextField
                      key={column.field}
                      id={column.field}
                      name={column.field}
                      label={column.label}
                      value={formData[column.field] || ''}
                      onChange={handleInputChange}
                      required={column.required}
                      style={column.style}
                      fullWidth
                      margin="normal"
                    />
                  )
                ))}
                <Button type="submit" variant="contained" color="primary" disabled={formMode === 'view'}>
                  {formMode === 'add' ? 'Add' : 'Update'}
                </Button>
              </form>
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




