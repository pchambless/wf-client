import React, { forwardRef, useState, useEffect, useCallback } from 'react';
import { 
  Box, Button, TextField, FormControl, InputLabel, 
  Select, MenuItem, Grid, CircularProgress, Divider 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import createLogger from '../../../utils/logger';
import { setVars, usePollVar, triggerAction, useActionTrigger } from '../../../utils/externalStore';
import { SELECTION } from '../../../actions/actionStore';

const log = createLogger('Form');

// ---- FORM FIELD COMPONENTS ----

const FormField = ({ field, value, onChange, disabled }) => {
  switch (field.displayType) {
    case 'multiLine':
      return (
        <TextField
          fullWidth
          multiline
          minRows={3}
          maxRows={8}
          label={field.label}
          value={value || ''}
          onChange={(e) => onChange(field.field, e.target.value)}
          required={field.required}
          disabled={disabled || field.calculated}
          sx={{ '& .MuiInputBase-root': { minHeight: '100px' } }}
        />
      );
      
    case 'select':
      return (
        <FormControl fullWidth required={field.required} disabled={disabled}>
          <InputLabel>{field.label}</InputLabel>
          <Select
            value={value || ''}
            onChange={(e) => onChange(field.field, e.target.value)}
            label={field.label}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {(field.selList || []).map(item => (
              <MenuItem 
                key={item.value || item.id} 
                value={item.value || item.id}
              >
                {item.label || item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
      
    case 'number':
      return (
        <TextField
          fullWidth
          type="number"
          label={field.label}
          value={value || ''}
          onChange={(e) => onChange(field.field, e.target.value)}
          required={field.required}
          disabled={disabled || field.calculated}
        />
      );
      
    default:
      return (
        <TextField
          fullWidth
          label={field.label}
          value={value || ''}
          onChange={(e) => onChange(field.field, e.target.value)}
          required={field.required}
          disabled={disabled || field.calculated}
        />
      );
  }
};

// ---- FIELD UTILITIES ----

// Group fields by their group property
const groupFields = (fields) => {
  const groups = {};
  
  fields.forEach(field => {
    const group = field.group || 0;
    if (!groups[group]) groups[group] = [];
    groups[group].push(field);
  });
  
  // Sort fields within each group by their order
  Object.keys(groups).forEach(group => {
    groups[group].sort((a, b) => (a.ordr || 0) - (b.ordr || 0));
  });
  
  // Return sorted group keys and the groups object
  return {
    groupKeys: Object.keys(groups).sort((a, b) => Number(a) - Number(b)),
    groups
  };
};

// Get form fields from columnMap
const getFormFields = (columnMap) => {
  if (!columnMap?.columns) return [];
  
  return columnMap.columns
    .filter(col => typeof col === 'object' && !col.hideInForm)
    .sort((a, b) => {
      // Sort by group first, then by order
      const groupA = a.group || 0;
      const groupB = b.group || 0;
      if (groupA !== groupB) return groupA - groupB;
      
      const orderA = a.ordr || 0;
      const orderB = b.ordr || 0;
      return orderA - orderB;
    });
};

// Process calculated fields
const calculateDerivedValues = (formData, fields) => {
  const newData = { ...formData };
  
  // Find fields with realTimeCalculation flag
  const calculatedFields = fields.filter(f => f.realTimeCalculation);
  
  // Apply calculations
  calculatedFields.forEach(field => {
    if (typeof field.calculateFn === 'function') {
      try {
        newData[field.field] = field.calculateFn(newData);
      } catch (err) {
        log.warn(`Error calculating ${field.field}:`, err);
      }
    }
  });
  
  return newData;
};

// ---- MAIN FORM COMPONENT ----

const Form = forwardRef(({ 
  columnMap, 
  formName = 'currentForm',
  onSubmit,
  formMode: propFormMode
}, ref) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  
  // Get form state from Redux if available, otherwise use props
  const storeFormMode = usePollVar(`form.${formName}.mode`, propFormMode || 'view');
  const storeFormData = usePollVar(`form.${formName}.data`, {});
  
  // Use Redux state if available, otherwise use local state
  const currentFormMode = storeFormMode || propFormMode || 'view';
  const currentFormData = Object.keys(storeFormData).length > 0 ? storeFormData : formData;
  
  // Update fields when columnMap changes
  useEffect(() => {
    if (columnMap && columnMap.columns) {
      try {
        const formFields = getFormFields(columnMap);
        setFields(formFields);
        
        log.debug('Form fields updated from columnMap:', {
          fieldCount: formFields.length,
          columnMapName: columnMap.name || 'unnamed'
        });
      } catch (err) {
        log.error('Error updating fields from columnMap:', err);
      }
    }
  }, [columnMap]);
  
  // Listen for row selection
  const rowSelection = useActionTrigger(SELECTION.ROW_SELECT);
  
  // When a row is selected, update form data
  useEffect(() => {
    if (!rowSelection) return;
    
    const { row } = rowSelection;
    if (row) {
      log.debug('Setting form data from row selection', { 
        fields: Object.keys(row).length 
      });
      
      // Update Redux store
      setVars({
        [`form.${formName}.mode`]: 'edit',
        [`form.${formName}.data`]: row
      });
      
      // Also update local state for non-Redux fallback
      setFormData(row);
    }
  }, [rowSelection, formName]);
  
  // Calculate derived values when dependencies change
  useEffect(() => {
    const calculatedData = calculateDerivedValues(currentFormData, fields);
    
    // Only update if something changed
    if (JSON.stringify(calculatedData) !== JSON.stringify(currentFormData)) {
      if (Object.keys(storeFormData).length > 0) {
        // Update Redux store
        setVars({ [`form.${formName}.data`]: calculatedData });
      } else {
        // Update local state
        setFormData(calculatedData);
      }
    }
  }, [currentFormData, fields, formName, storeFormData]);
  
  // Set form mode
  const setFormMode = useCallback((mode) => {
    log.debug(`Setting form mode to "${mode}"`);
    setVars({ [`form.${formName}.mode`]: mode });
  }, [formName]);
  
  // Set form data
  const setFormDataFn = useCallback((data) => {
    log.debug('Setting form data', { fields: Object.keys(data) });
    
    // Update Redux store
    setVars({ [`form.${formName}.data`]: data });
    
    // Also update local state for non-Redux fallback
    setFormData(data);
  }, [formName]);
  
  // Update form data (partial)
  const updateFormData = useCallback((updates) => {
    const newData = { ...currentFormData, ...updates };
    
    // Run calculations on the updated data
    const calculatedData = calculateDerivedValues(newData, fields);
    
    // Update Redux store
    setVars({ [`form.${formName}.data`]: calculatedData });
    
    // Also update local state for non-Redux fallback
    setFormData(calculatedData);
  }, [currentFormData, fields, formName]);
  
  // Reset form
  const resetForm = useCallback(() => {
    setVars({
      [`form.${formName}.mode`]: 'view',
      [`form.${formName}.data`]: {}
    });
    
    // Also reset local state
    setFormData({});
  }, [formName]);
  
  // Form submission
  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (onSubmit) {
        const result = await onSubmit(currentFormData, currentFormMode);
        log.debug('Form submission complete', { result });
        return result;
      }
      return { success: true, data: currentFormData };
    } catch (err) {
      log.error('Form submission failed:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [currentFormData, onSubmit, currentFormMode]);
  
  // Handle field changes
  const handleChange = useCallback((field, value) => {
    updateFormData({ [field]: value });
  }, [updateFormData]);
  
  // Group fields for rendering
  const { groupKeys, groups } = groupFields(fields);
  
  // Expose methods via ref
  React.useImperativeHandle(ref, () => ({
    getFormData: () => currentFormData,
    setFormData: setFormDataFn,
    setFormMode,
    handleSubmit,
    resetForm,
    refresh: (newMode) => {
      log.debug('Form refresh requested', { newMode });
      
      if (newMode) {
        setFormMode(newMode);
        
        // Reset form data when switching to add mode
        if (newMode === 'add') {
          setFormDataFn({});
        }
      }
      
      // Re-calculate any derived values
      const calculatedData = calculateDerivedValues(currentFormData, fields);
      if (JSON.stringify(calculatedData) !== JSON.stringify(currentFormData)) {
        setFormDataFn(calculatedData);
      }
      
      // Trigger a UI refresh
      triggerAction('FORM_REFRESH', { formName, timestamp: Date.now() });
    }
  }), [currentFormData, setFormDataFn, setFormMode, handleSubmit, resetForm, formName, fields]);
  
  return (
    <Box 
      sx={{
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        boxShadow: theme.shadows[1],
      }}
    >
      {/* Render fields by group */}
      {groupKeys.map(groupKey => (
        <Box key={groupKey} sx={{ mb: 2 }}>
          {/* Show group divider if it's not the first group and has a non-zero key */}
          {groupKey !== '0' && groupKey !== groupKeys[0] && (
            <Divider sx={{ my: 2 }} />
          )}
          
          {/* Grid layout for this group's fields */}
          <Grid container spacing={2}>
            {groups[groupKey].map(field => (
              <Grid 
                item 
                key={field.field}
                xs={12} 
                md={field.displayType === 'multiLine' ? 12 : 6}
              >
                <FormField
                  field={field}
                  value={currentFormData[field.field] || ''}
                  onChange={handleChange}
                  disabled={currentFormMode === 'view'}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
      
      {currentFormMode !== 'view' && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      )}
      
      {error && (
        <Box sx={{ mt: 2, color: 'error.main' }}>
          {error}
        </Box>
      )}
    </Box>
  );
});

export default Form;
