import React, { useState, useEffect, useMemo } from 'react';
import { Box, Grid } from '@mui/material';
import createLogger from '../../utils/logger'; // Import the createLogger function
import { useGlobalContext } from '../../context/GlobalContext';
import CrudTable from './CrudTable'; // Import CrudTable
import CrudForm from './CrudForm'; // Import CrudForm
import Modal from '../modal/Modal'; // Import Modal

const log = createLogger('CrudTemplate'); // Create a logger for the CrudTemplate component

const CrudTemplate = React.memo(({ pageName, tabIndex, setTabIndex, onRowSelection, children }) => {
  const { updatePageTitle, getPageConfig } = useGlobalContext();
  const [modalContent, setModalContent] = useState(null); // State to manage modal content
  const [formData, setFormData] = useState({});
  const [formMode, setFormMode] = useState('add');

  // Component lifecycle logging
  useEffect(() => {
    log('Component mounted', { pageName, tabIndex });
    return () => log('Component unmounting', { pageName });
  }, [pageName, tabIndex]);

  const pageConfig = useMemo(() => {
    log('Getting page config', { pageName });
    return getPageConfig(pageName);
  }, [pageName, getPageConfig]);

  useEffect(() => {
    if (pageConfig?.pageTitle) {
      log('Updating page title', { title: pageConfig.pageTitle });
      updatePageTitle(pageConfig.pageTitle);
    }
  }, [pageConfig?.pageTitle, updatePageTitle]);

  const {
    listEvent,
    keyField,
    columnMap = [],
  } = pageConfig || {};

  log('Page configuration loaded', {
    hasListEvent: !!listEvent,
    keyField,
    columnCount: columnMap.length
  });

  const handleModalClose = () => {
    log('Closing modal');
    setModalContent(null);
  };

  const handleFormSubmit = async (formData) => {
    const endTimer = log.startPerformanceTimer('formSubmission');
    try {
      log('Submitting form', { 
        mode: formMode, 
        keyField: formData[keyField],
        formFields: Object.keys(formData)
      });
      // Add your form submission logic here
      // For example, you can call an API to save the form data
      endTimer();
    } catch (error) {
      log('Form submission failed', { 
        error: error.message,
        formMode,
        keyField: formData[keyField]
      });
      endTimer();
      throw error;
    }
  };

  // Modified to delegate row selection to the parent component
  const handleRowSelection = () => {
    log('Row selected in CrudTemplate', { 
      currentTab: tabIndex,
      willCallParentHandler: !!onRowSelection
    });
    
    // Call the parent's onRowSelection handler instead of changing tabs directly
    if (onRowSelection) {
      onRowSelection();
    }
  };

  const shouldRenderTable = useMemo(() => {
    const hasListEvent = !!listEvent;
    log('Checking if table should render', { hasListEvent });
    return hasListEvent;
  }, [listEvent]);

  return (
    <Box display="flex" flexDirection="column" height="100%" width="100%">
      <Grid container spacing={2}>
        {shouldRenderTable && (
          <>
            <Grid item xs={12} md={6}>
              <Box p={2} borderRadius={2} bgcolor="background.paper" boxShadow={3} height="100%">
                <CrudTable columnMap={columnMap} listEvent={listEvent} keyField={keyField} setFormData={setFormData} setFormMode={setFormMode} onRowSelection={handleRowSelection} />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box p={2} borderRadius={2} bgcolor="background.paper" boxShadow={3} height="100%">
                <CrudForm pageConfig={columnMap} formData={formData} formMode={formMode} onSubmit={handleFormSubmit} />
              </Box>
            </Grid>
          </>
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

CrudTemplate.displayName = 'CrudTemplate';

export default CrudTemplate;
