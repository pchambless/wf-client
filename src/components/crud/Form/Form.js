import React, { forwardRef, useState, useEffect, useRef, useCallback } from 'react';
import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import { FormFieldRenderer } from '../FormField';
import { FormPresenter } from './Presenter';
import createLogger from '../../../utils/logger';
import { useActionTrigger } from '../../../utils/externalStore';
import { SELECTION } from '../../../actions/actionStore';

const log = createLogger('Form');

const Form = forwardRef(({ columnMap, onSubmit, formMode: propFormMode }, ref) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  
  // Create presenter once
  const presenterRef = useRef(null);
  if (!presenterRef.current) {
    presenterRef.current = new FormPresenter(columnMap);
  }
  const presenter = presenterRef.current;
  
  // Update presenter's columnMap if it changes
  useEffect(() => {
    presenter.columnMap = columnMap;
  }, [presenter, columnMap]);
  
  // INITIALIZATION - Run this once
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    async function initializeForm() {
      setLoading(true);
      try {
        // Use presenter to get fields
        const formFields = presenter.getFields();
        setFields(formFields);
        
        log.debug('Form initialized with fields:', formFields.length);
      } catch (error) {
        log.error('Error initializing form:', error);
      } finally {
        setLoading(false);
      }
    }
    
    initializeForm();
  }, [presenter]); 
  
  // ROW SELECTION - Listen for table row clicks
  const rowSelectAction = useActionTrigger(SELECTION.ROW_SELECT);

  useEffect(() => {
    // Early bail-out if we don't have an action
    if (!rowSelectAction) {
      return;
    }
    
    log.debug('Row selection action received:', rowSelectAction);
    
    // IMPORTANT: In your case, rowSelectAction IS the payload
    // Your action store is returning the payload directly, not {type, payload}
    const actionData = rowSelectAction; 
    
    log.debug('Processing row data:', {
      id: actionData.id,
      rowData: actionData.row ? Object.keys(actionData.row) : 'none',
      columnValues: actionData.columnValues ? Object.keys(actionData.columnValues) : 'none'
    });
    
    // Process the row data with FormPresenter
    const processedData = presenter.processRowData(actionData);
    
    // Log and update form state
    log.debug('Form data processed:', {
      fieldCount: Object.keys(processedData).length,
      fields: Object.keys(processedData)
    });
    
    setFormData(processedData);
  }, [rowSelectAction, presenter]);

  // Add this at the component level to see what's going on
  useEffect(() => {
    if (rowSelectAction) {
      log.debug('Row action structure:', {
        hasPayload: Boolean(rowSelectAction?.payload),
        isDirectData: Boolean(rowSelectAction?.id || rowSelectAction?.row),
        keys: Object.keys(rowSelectAction)
      });
    }
  }, [rowSelectAction]);
  
  // FORM SUBMISSION
  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use presenter to submit form
      const result = await presenter.submitForm(formData);
      if (result) {
        log.info('Form submitted successfully');
        onSubmit?.();
        return true;
      }
      return false;
    } catch (err) {
      log.error('Form submission failed:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [presenter, formData, onSubmit]);
  
  // INPUT CHANGES
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({...prev, [field]: value}));
  }, []);
  
  // Expose methods to parent components via ref
  React.useImperativeHandle(ref, () => ({
    getFormData: () => formData,
    setFormData: (data, mode) => {
      log.debug('setFormData called with mode:', mode);
      setFormData(prev => ({...prev, ...data}));
      // Update form mode if provided
      if (mode) {
        log.debug(`Setting form mode to: ${mode}`);
        // Update form mode if passed
      }
    },
    handleSubmit,
    // Add refresh method to match the API expected by CrudLayout
    refresh: (newMode) => {
      log.debug(`Form refresh called with mode: ${newMode || 'none'}`);
      // If a new mode is provided, update it
      if (newMode) {
        log.debug(`Setting form mode to: ${newMode}`);
        // Any mode-specific logic would go here
      }
      
      // Reset form data if we're switching to 'add' mode
      if (newMode === 'add') {
        setFormData({});
      }
      
      // Re-fetch fields from the current columnMap
      const formFields = presenter.getFields();
      setFields(formFields);
      
      log.debug('Form refreshed with fields:', {
        count: formFields.length,
        mode: newMode || 'current'
      });
    }
  }), [formData, handleSubmit, presenter]);
  
  // RENDER THE FORM
  return (
    <Box 
      className="form-container" 
      sx={{
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[1],
      }}
    >
      <FormFieldRenderer 
        visibleFields={fields}
        formData={formData}
        handleInputChange={handleInputChange}
        loading={loading}
        error={error}
      />
      
      {propFormMode !== 'view' && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      )}
    </Box>
  );
});

export default Form;
