import React, { useState, useEffect, useMemo } from 'react';
import { Box, Grid } from '@mui/material';
import useLogger from '../hooks/useLogger';
import Form from '../components/page/Form';
import Table from '../components/page/Table';
import { useGlobalContext } from '../context/GlobalContext';

const CrudLayout = ({ pageConfig }) => {
  const log = useLogger('CrudLayout');
  const { updatePageTitle } = useGlobalContext();
  const [selectedItem, setSelectedItem] = useState(null);
  const [mode, setMode] = useState('view');

  useEffect(() => {
    if (pageConfig.pageTitle) {
      updatePageTitle(pageConfig.pageTitle);
    }
  }, [pageConfig.pageTitle, updatePageTitle]);

  useEffect(() => {
    // Fetch data based on pageConfig.listEvent
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/${pageConfig.listEvent}`);
        const result = await response.json();
        log('Data fetched successfully:', result);
      } catch (error) {
        log('Error fetching data:', error);
      }
    };

    fetchData();
  }, [pageConfig.listEvent, log]);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setMode('edit');
  };

  const handleFormSubmit = async (formData) => {
    try {
      const method = mode === 'add' ? 'POST' : 'PUT';
      const response = await fetch(`/api/${pageConfig.dbTable}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      log('Form submitted successfully:', result);
      setMode('view');
      // Refresh data
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/${pageConfig.listEvent}`);
          const result = await response.json();
          log('Data fetched successfully:', result);
        } catch (error) {
          log('Error fetching data:', error);
        }
      };

      fetchData();
    } catch (error) {
      log('Error submitting form:', error);
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
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CrudLayout;
