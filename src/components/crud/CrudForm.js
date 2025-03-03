import React, { useEffect, useState, useMemo } from 'react';
import { Box, Button, Grid, TextField, Typography, CircularProgress } from '@mui/material';
import DatePick from '../page/DatePicker'; // Import the DatePick component
import Select from '../page/Select'; // Import the Select component
import { getVar, setVars } from '../../utils/externalStore'; // Import getVar and setVars
import useLogger from '../../hooks/useLogger';

const CrudForm = ({ pageConfig, formData, formMode, onSubmit }) => {
  const log = useLogger('CrudForm');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localFormData, setLocalFormData] = useState({});

  // Component lifecycle logging
  useEffect(() => {
    log.debug('CrudForm component mounted', { 
      mode: formMode,
      hasInitialData: Object.keys(formData || {}).length > 0 
    });
    return () => log.debug('CrudForm component unmounting');
  }, [log, formMode, formData]);

  // Initialize form data
  useEffect(() => {
    const endTimer = log.startPerformanceTimer('formInitialization');
    log.debug('Initializing form data', {
      mode: formMode,
      fields: Object.keys(formData || {})
    });

    try {
      const initialData = { ...formData };
      // Initialize values from external store if setVar is defined
      pageConfig?.forEach(field => {
        if (field.setVar) {
          const storedValue = getVar(field.setVar);
          if (storedValue !== undefined) {
            initialData[field.field] = storedValue;
          }
        }
      });

      setLocalFormData(initialData || {});
      log.debug('Form data initialized', {
        fieldCount: Object.keys(initialData).length,
        hasExternalValues: Object.keys(initialData).some(key => getVar(key) !== undefined)
      });
      endTimer();
    } catch (err) {
      log.error('Form initialization failed', {
        error: err.message,
        mode: formMode
      });
      setError(err.message);
      endTimer();
    }
  }, [formData, formMode, pageConfig, log]);

  const visibleFields = useMemo(() => {
    if (!pageConfig) {
      log.warn('No page configuration provided');
      return [];
    }
    const fields = pageConfig.filter(field => field.group >= 2);
    log.debug('Visible form fields calculated', { 
      totalFields: fields.length,
      fieldNames: fields.map(f => f.field),
      fieldTypes: fields.map(f => ({ field: f.field, type: f.dataType || 'text', hasSelect: !!f.selList }))
    });
    return fields;
  }, [pageConfig, log]);

  const handleInputChange = (field, value, fieldConfig) => {
    log.debug('Form field changed', {
      field,
      value,
      previousValue: localFormData[field],
      fieldType: fieldConfig?.dataType || 'text'
    });

    // Update external store if setVar is defined
    if (fieldConfig?.setVar) {
      setVars({ [fieldConfig.setVar]: value });
    }

    setLocalFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function to construct DML request structure
  const constructDmlRequest = (formData) => {
    if (!pageConfig) return null;

    try {
      // Determine the operation type based on formMode
      const method = formMode === 'add' ? 'INSERT' : formMode === 'edit' ? 'UPDATE' : 'DELETE';
      
      // Find the table configuration
      const dbTable = pageConfig.find(field => field.dbTable)?.dbTable;
      
      // Get where clause fields (group === -1)
      const whereFields = pageConfig
        .filter(field => field.group === -1)
        .map(field => ({
          column: field.dbColumn,
          value: getVar(field.getVar),
          field: field.field
        }));

      // Get data fields (excluding where clause fields)
      const dataFields = pageConfig
        .filter(field => field.group !== -1 && field.dbColumn)
        .map(field => ({
          column: field.dbColumn,
          value: formData[field.field],
          field: field.field
        }));

      const requestStructure = {
        method,
        dbTable,
        data: dataFields,
        where: whereFields
      };

      log.debug('Constructed DML request structure', {
        method,
        dbTable,
        dataFieldCount: dataFields.length,
        whereFieldCount: whereFields.length,
        structure: requestStructure
      });

      return requestStructure;
    } catch (err) {
      log.error('Failed to construct DML request', {
        error: err.message,
        formMode,
        hasPageConfig: !!pageConfig
      });
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endTimer = log.startPerformanceTimer('formSubmission');
    
    log.info('Form submission started', {
      mode: formMode,
      fields: Object.keys(localFormData)
    });

    setLoading(true);
    setError(null);

    try {
      // Construct and log the DML request structure
      const dmlRequest = constructDmlRequest(localFormData);
      if (dmlRequest) {
        log.info('DML request prepared', {
          method: dmlRequest.method,
          table: dmlRequest.dbTable,
          affectedFields: dmlRequest.data.map(d => d.field)
        });
      }

      await onSubmit(localFormData);
      log.info('Form submission successful', { mode: formMode });
      endTimer();
    } catch (err) {
      log.error('Form submission failed', {
        error: err.message,
        mode: formMode,
        formData: localFormData
      });
      setError(err.message);
      endTimer();
    } finally {
      setLoading(false);
    }
  };

  const renderField = (fieldConfig) => {
    const fieldValue = localFormData[fieldConfig.field] || '';
    const isRequired = fieldConfig.required === 1 || fieldConfig.required === undefined;

    // Render Select field
    if (fieldConfig.selList) {
      log.debug('Rendering Select field', { 
        field: fieldConfig.field, 
        hasValue: !!fieldValue,
        eventType: fieldConfig.selList
      });
      return (
        <Select
          eventType={fieldConfig.selList}
          placeholder={fieldConfig.label}
          onChange={(value) => handleInputChange(fieldConfig.field, value, fieldConfig)}
          value={fieldValue}
          disabled={loading}
          required={isRequired}
          error={!!error && !fieldValue}
        />
      );
    }

    // Render DatePicker field
    if (fieldConfig.dataType === 'DATE') {
      log.debug('Rendering DatePicker field', { 
        field: fieldConfig.field, 
        hasValue: !!fieldValue
      });
      return (
        <DatePick
          placeholder={fieldConfig.label}
          onChange={(date) => handleInputChange(fieldConfig.field, date, fieldConfig)}
          value={fieldValue}
          disabled={loading}
          required={isRequired}
          error={!!error && !fieldValue}
          varName={fieldConfig.setVar}
        />
      );
    }

    // Render TextField (default)
    log.debug('Rendering TextField', { 
      field: fieldConfig.field, 
      hasValue: !!fieldValue,
      isMultiline: fieldConfig.multiline
    });
    return (
      <TextField
        fullWidth
        label={fieldConfig.label}
        name={fieldConfig.field}
        value={fieldValue}
        onChange={(e) => handleInputChange(fieldConfig.field, e.target.value, fieldConfig)}
        disabled={loading}
        required={isRequired}
        error={!!error && !fieldValue}
        helperText={fieldConfig.helperText}
        multiline={fieldConfig.multiline}
        rows={fieldConfig.multiline ? 3 : 1}
      />
    );
  };

  if (!pageConfig) {
    log.warn('Rendering empty state - no page configuration');
    return null;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        {formMode === 'add' ? 'Add New Record' : 'Edit Record'}
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={2}>
        {visibleFields.map((field) => (
          <Grid item xs={12} sm={6} key={field.field}>
            {renderField(field)}
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : formMode === 'add' ? 'Add' : 'Update'}
        </Button>
      </Box>
    </Box>
  );
};

export default CrudForm;
