import React, { useState, useEffect, useMemo } from 'react';
import { Box, Grid } from '@mui/material';
import createLogger from '../../utils/logger';
import CrudTable from './CrudTable';
import CrudForm from './CrudForm';
import Modal from '../modal/Modal';
import { getVar, setVars } from '../../utils/externalStore';

// Import from stores instead of context
import { usePageStore, useConfigStore } from '../../stores';

const log = createLogger('CrudTemplate');

const CrudTemplate = ({ pageName, tabIndex, _setTabIndex, onRowSelection, children }) => {
  // Use our new stores instead of GlobalContext
  const { setPageTitle } = usePageStore();
  const { getPageConfig } = useConfigStore();
  
  const [modalContent, setModalContent] = useState(null);
  const [formData, setFormData] = useState({});

  // Component lifecycle logging
  useEffect(() => {
    log('Component mounted', { pageName, tabIndex });
    
    // Initialize formMode in external store if not already set
    if (!getVar(':formMode')) {
      setVars({ ':formMode': 'add' });
      log('Initialized :formMode in external store to "add"');
    }
    
    return () => log('Component unmounting', { pageName });
  }, [pageName, tabIndex]);

  const pageConfig = useMemo(() => {
    log('Getting page config', { pageName });
    return getPageConfig(pageName);
  }, [pageName, getPageConfig]);

  useEffect(() => {
    if (pageConfig?.pageTitle) {
      log('Updating page title', { title: pageConfig.pageTitle });
      setPageTitle(pageConfig.pageTitle);
    }
  }, [pageConfig?.pageTitle, setPageTitle]);

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

  // Modify the handleFormSubmit to use external store
  const handleFormSubmit = async (formData) => {
    const endTimer = log.startPerformanceTimer('formSubmission');
    const formMode = getVar(':formMode') || 'add'; // Get from external store
    
    try {
      log('Submitting form', { 
        mode: formMode, 
        keyField: formData[keyField],
        formFields: Object.keys(formData)
      });
      // Your form submission logic here
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
                {/* Remove setFormMode since we're using external store */}
                <CrudTable 
                  columnMap={columnMap} 
                  listEvent={listEvent} 
                  keyField={keyField} 
                  setFormData={setFormData} 
                  onRowSelection={handleRowSelection} 
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box p={2} borderRadius={2} bgcolor="background.paper" boxShadow={3} height="100%">
                <CrudForm 
                  pageConfig={columnMap} 
                  formData={formData} 
                  onSubmit={handleFormSubmit} 
                  setFormData={setFormData}
                />
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
};

CrudTemplate.displayName = 'CrudTemplate';

export default CrudTemplate;
