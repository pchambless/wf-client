import React, { useState, useEffect, useMemo } from 'react';
import { Box, Grid } from '@mui/material';
import useLogger from '../hooks/useLogger';
import Form from '../components/page/Form';
import Table from '../components/page/Table';
import { useGlobalContext } from '../context/GlobalContext';
import { useEventTypeContext } from '../context/EventTypeContext';

const CrudLayout = ({ pageConfig }) => {
  const log = useLogger('CrudLayout');
  const { updatePageTitle } = useGlobalContext();
  const { execEvent } = useEventTypeContext();
  const [selectedItem, setSelectedItem] = useState(null);
  const [mode, setMode] = useState('view');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pageConfig.pageTitle) {
      updatePageTitle(pageConfig.pageTitle);
    }
  }, [pageConfig.pageTitle, updatePageTitle]);

  const fetchData = async () => {
    if (!pageConfig.listEvent) {
      log.warn('No listEvent provided, skipping data fetch');
      return;
    }
    try {
      setLoading(true);
      log.debug('Fetching data...', { listEvent: pageConfig.listEvent });
      const result = await execEvent(pageConfig.listEvent);
      log.debug('Data fetched successfully', { count: result?.length });
      setData(result);
      setError(null);
    } catch (error) {
      log.error('Error fetching data', {
        listEvent: pageConfig.listEvent,
        error: error.message,
        stack: error.stack
      });
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageConfig.listEvent]);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setMode('edit');
  };

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);
      const eventType = mode === 'add' ? pageConfig.addEvent : pageConfig.editEvent;
      
      log.debug('Submitting form', { mode, eventType });
      const result = await execEvent(eventType, formData);
      
      log.debug('Form submitted successfully', { result });
      setMode('view');
      
      // Refresh data
      await fetchData();
    } catch (error) {
      log.error('Error submitting form', {
        mode,
        error: error.message,
        stack: error.stack
      });
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormModeChange = (mode) => {
    setMode(mode);
    if (mode === 'add') {
      setSelectedItem(null);
    }
  };

  const shouldRenderTable = useMemo(() => !!pageConfig.listEvent, [pageConfig.listEvent]);
  const shouldRenderForm = useMemo(() => !!(pageConfig.editEvent || pageConfig.addEvent), [pageConfig.editEvent, pageConfig.addEvent]);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Grid container spacing={2}>
        {shouldRenderTable && (
          <Grid item xs={12} md={6}>
            <Box p={2} borderRadius={2} bgcolor="background.paper" boxShadow={3}>
              <Table
                pageConfig={pageConfig}
                onRowClick={handleSelectItem}
                data={data}
                loading={loading}
                error={error}
              />
            </Box>
          </Grid>
        )}
        {shouldRenderForm && (
          <Grid item xs={12} md={6}>
            <Box p={2} borderRadius={2} bgcolor="background.paper" boxShadow={3}>
              <Form
                pageConfig={pageConfig}
                data={selectedItem}
                mode={mode}
                onSubmit={handleFormSubmit}
                onModeChange={handleFormModeChange}
                loading={loading}
                error={error}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CrudLayout;
