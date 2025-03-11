import React, { useEffect, useState, useMemo } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { getVar, setVars } from '../../utils/externalStore';
import createLogger from '../../utils/logger';
import crudDML from '../../utils/crudDML';
import FormFieldRenderer from './FormFieldRenderer';
import { useForm } from '../../utils/formStore';

const log = createLogger('CrudForm');

const CrudForm = ({ pageConfig, pageName, formData: propFormData, formMode: propFormMode, onSubmit }) => {
  // Add this logging at the beginning of the component:

  useEffect(() => {
    log('CrudForm mounted with pageName:', { pageName });
    if (!pageName) {
      log.warn('No pageName provided to CrudForm - form state may not be properly shared');
    }
    return () => log('CrudForm unmounting:', { pageName });
  }, [pageName]);

  // Use the hook for React integration with fallback to props
  const { mode, data, updateData } = useForm(pageName, {
    initialMode: propFormMode || 'add',
    initialData: propFormData || {}
  });
  
  // Use mode and data from the form store

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [localFormData, setLocalFormData] = useState({});

  // Component lifecycle logging
  useEffect(() => {
    log('CrudForm component mounted', { 
      mode,
      hasInitialData: Object.keys(data || {}).length > 0 
    });
    return () => log('CrudForm component unmounting');
  }, [mode, data]);

  // Add logging to check formMode:
  // At the top of the component, add log to see when formMode changes
  useEffect(() => {
    log('Form mode changed', { mode });
  }, [mode]);

  // Initialize form data
  useEffect(() => {
    log('Initializing form data', {
      mode,
      fields: Object.keys(data || {})
    });

    try {
      const initialData = { ...data };
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
      log('Form data initialized', {
        fieldCount: Object.keys(initialData).length,
        hasExternalValues: Object.keys(initialData).some(key => getVar(key) !== undefined)
      });
    } catch (err) {
      log.error('Form initialization failed', {
        error: err.message,
        mode
      });
      setError(err.message);
    }
  }, [data, mode, pageConfig]);

  // Update the visibleFields useMemo calculation:

  const visibleFields = useMemo(() => {
    if (!pageConfig) {
      log.warn('No page configuration provided');
      return [];
    }
    
    // Only show fields with group > 0 (exclude -1 and 0 groups)
    const fields = pageConfig
      .filter(field => field.group > 0)
      .sort((a, b) => a.group - b.group); // Simple sort by group number
    
    log('Visible form fields calculated', { 
      totalFields: fields.length,
      fieldsByGroup: fields.reduce((acc, field) => {
        if (!acc[field.group]) acc[field.group] = [];
        acc[field.group].push(field.field);
        return acc;
      }, {})
    });
    
    return fields;
  }, [pageConfig]);

  const handleInputChange = (field, value, fieldConfig) => {
    log('Form field changed', {
      field,
      value,
      previousValue: localFormData[field],
      fieldType: fieldConfig?.dataType || 'text'
    });

    // Update external store if setVar is defined
    if (fieldConfig?.setVar) {
      setVars({ [fieldConfig.setVar]: value });
    }

    // Update local state
    setLocalFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Fix: Pass an object to updateData with field/value pair
    updateData({ [field]: value });
  };

  // Helper function to construct DML request structure
  const constructDmlRequest = (formData) => {
    if (!pageConfig) return null;

    try {
      // Determine the operation type based on formMode
      const method = mode === 'add' ? 'INSERT' : mode === 'edit' ? 'UPDATE' : 'DELETE';
      
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

      log('Constructed DML request structure', {
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
        formMode: mode,
        hasPageConfig: !!pageConfig
      });
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    log('Form submission started', {
      mode,
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
        await crudDML(dmlRequest);
      }

      await onSubmit(localFormData);
      log('Form submission successful', { mode });
    } catch (err) {
      log('Form submission failed', {
        error: err.message,
        mode,
        formData: localFormData
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!pageConfig) {
    log('Rendering empty state - no page configuration');
    return null;
  }

  const firstFieldValue = localFormData[visibleFields[0]?.field] || '';

  // Also log the formMode right before rendering to verify what's being used
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {log('Rendering form with mode', { 
        formMode: mode, 
        isAdd: mode === 'add',
        isEdit: mode === 'edit',
        buttonText: mode === 'add' ? 'Add' : mode === 'edit' ? 'Update' : 'Delete'
      })}
      <Typography variant="h6" gutterBottom>
        {mode === 'add' ? 'Add New Record' : mode === 'edit' ? `Edit ${firstFieldValue || 'Record'}` : `Delete ${firstFieldValue || 'Record'}`}
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Log the fields being passed to FormFieldRenderer */}
      {log('Passing fields to FormFieldRenderer', {
        count: visibleFields.length,
        fields: visibleFields.map(field => ({
          field: field.field,
          label: field.label, 
          dataType: field.dataType,
          fieldType: field.fieldType,
          hasValue: field.field in localFormData
        }))
      })}

      <FormFieldRenderer 
        visibleFields={visibleFields}
        formData={localFormData}
        handleInputChange={handleInputChange}
        loading={loading}
        error={error}
      />

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            mode === 'add' ? 'Add' : mode === 'edit' ? 'Update' : 'Delete'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default CrudForm;
