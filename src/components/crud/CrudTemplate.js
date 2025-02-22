import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Box, Grid, Typography, Button, CircularProgress } from '@mui/material';
import useLogger from '../../hooks/useLogger';
import { setVars } from '../../utils/externalStore';
import { useEventTypeContext } from '../../context/EventTypeContext';
import { useGlobalContext } from '../../context/GlobalContext';
import CrudTable from './CrudTable'; // Import CrudTable
import CrudForm from './CrudForm'; // Import CrudForm
import Modal from '../modal/Modal'; // Import Modal

const CrudTemplate = React.memo(({ pageName, tabIndex, onRowSelection, children }) => {
  const log = useLogger('CrudTemplate');
  const { updatePageTitle, getPageConfig } = useGlobalContext();
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [formMode, setFormMode] = useState('add');
  const [loading, setLoading] = useState(true);
  const { execEvent } = useEventTypeContext();
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null); // State to store selected row
  const [selectOptions, setSelectOptions] = useState({}); // State to store select options
  const [modalContent, setModalContent] = useState(null); // State to manage modal content

  log('PageName:', pageName);

  const pageConfig = useMemo(() => getPageConfig(pageName), [pageName, getPageConfig]);

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
    if (!listEvent) {
      log('No listEvent provided, skipping data fetch');
      return;
    }
    try {
      log('Fetching data...');
      setLoading(true);
      const result = await execEvent(listEvent);
      log('Data fetched:', result);
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      log('Error fetching data:', err);
      setError(err.message);
      setModalContent({ type: 'error', message: err.message }); // Set modal content for error
    } finally {
      setLoading(false);
    }
  }, [listEvent, execEvent, log]);

  useEffect(() => {
    log('useEffect triggered');
    fetchDataCallback();
  }, [fetchDataCallback, log]);

  useEffect(() => {
    return () => {
      // Reset state when component is unmounted
      setData([]);
      setFormData({});
      setFormMode('add');
      setSelectedRow(null);
      setSelectOptions({});
      setError(null);
      setModalContent(null);
    };
  }, []);

  const fetchSelectOptions = useCallback(async () => {
    const options = {};
    for (const column of columnMap) {
      if (column.selList) {
        try {
          log(`Fetching options for ${column.field}...`);
          const result = await execEvent(column.selList);
          log(`Options fetched for ${column.field}:`, result);
          options[column.field] = Array.isArray(result) ? result : [];
        } catch (err) {
          log(`Error fetching options for ${column.field}:`, err);
        }
      }
    }
    setSelectOptions(options);
  }, [columnMap, execEvent, log]);

  useEffect(() => {
    fetchSelectOptions();
  }, [fetchSelectOptions]);

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

    if (onRowSelection) {
      console.log('Row selection callback triggered');
      onRowSelection();
    }
  }, [columnMap, keyField, log, onRowSelection]);

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

  const handleModalClose = () => {
    setModalContent(null);
    setError(null);
  };

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
    return (
      <>
        <Typography color="error">Error fetching data: {error}</Typography>
        <Modal isOpen={!!modalContent} onRequestClose={handleModalClose} content={modalContent} />
      </>
    );
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
              <CrudTable data={data} columnMap={columnMap} onRowClick={handleRowClick} selectedRow={selectedRow} selectOptions={selectOptions} /> {/* Pass selectedRow and selectOptions */}
            </Box>
          </Grid>
        )}
        {shouldRenderForm && (
          <Grid item xs={12} md={6}>
            <Box p={2} borderRadius={2} bgcolor="background.paper" boxShadow={3} height="100%">
              <CrudForm pageConfig={columnMap} formData={formData} setFormData={setFormData} selectOptions={selectOptions} /> {/* Use CrudForm */}
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
      <Modal isOpen={!!modalContent} onRequestClose={handleModalClose} content={modalContent} />
    </Box>
  );
});

export default CrudTemplate;
