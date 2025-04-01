import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Box, Grid, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Table from './Table';
import Form from './Form';
import createLogger from '../../utils/logger';
import { setVar } from '../../utils/externalStore';
import { ACTION_TYPES, startUserAction } from '../../utils/logger/actions';

const CrudLayout = ({ columnMap, listEvent, onRowSelection, pageTitle }) => {
  const log = createLogger('CrudLayout');
  const formRef = useRef();
  const [formMode, setFormMode] = useState('view');

  useEffect(() => {
    if (pageTitle) {
      setVar(':pageTitle', pageTitle);
    }
  }, [pageTitle]);

  const clearFormFields = useCallback(() => {
    log.debug('Clearing form fields');
    columnMap?.columns?.forEach(col => {
      if (col.setVar) {
        setVar(col.setVar, '');
        log.debug('Cleared var:', {
          var: col.setVar,
          value: ''
        });
      }
    });
  }, [columnMap, log]);

  const handleRowSelect = useCallback((row) => {
    log.debug('Row selected in CrudLayout:', row);
    onRowSelection?.(row);
    
    // Just refresh the form
    if (formRef.current) {
      formRef.current.refresh();
    }
  }, [onRowSelection, log]);

  const handleAddNew = () => {
    startUserAction(ACTION_TYPES.ADD_NEW);
    log.debug('Add New clicked');
    clearFormFields();
    onRowSelection?.(null);
    setFormMode('add');
    formRef.current?.refresh('add');
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
        >
          Add New
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={7}>
          <Table 
            columnMap={columnMap}
            listEvent={listEvent}
            onRowSelect={handleRowSelect}
          />
        </Grid>
        <Grid item xs={5}>
          <Form 
            ref={formRef}
            columnMap={columnMap}
            formMode={formMode}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CrudLayout;
