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
  
  // Update presenter's columnMap if it changes and REFRESH FIELDS
  useEffect(() => {
    // Always update presenter with latest columnMap
    presenter.columnMap = columnMap;
    
    // Set the current form mode in the presenter
    if (propFormMode) {
      presenter.setFormMode(propFormMode);
    }
    
    // CRITICAL: Re-fetch fields when columnMap changes - key to solving our issue
    if (columnMap && columnMap.columns) {
      try {
        const formFields = presenter.getFields();
        setFields(formFields);
        
        log.debug('Form fields updated due to columnMap change:', {
          fieldCount: formFields.length,
          fieldTypes: formFields.map(f => ({ id: f.id, type: f.type, group: f.group })),
          columnMapName: columnMap.name || 'unnamed'
        });
        
        // Clear form data when tab changes to avoid showing wrong field values
        setFormData({});
      } catch (err) {
        log.error('Error updating fields from columnMap:', err);
      }
    }
  }, [presenter, columnMap, propFormMode]);
  
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
      // Set form mode before submitting
      presenter.setFormMode(propFormMode || 'add');
      
      // Use presenter to submit form
      const result = await presenter.submitForm(formData);
      if (result && result.success) {
        log.info('Form submitted successfully');
        onSubmit?.(result);
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
  }, [presenter, formData, onSubmit, propFormMode]);
  
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
        // Reduce padding to make the form more compact
        padding: theme.spacing(1),
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            // Make button smaller
            size="small"
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      )}
    </Box>
  );
});

export default Form;
