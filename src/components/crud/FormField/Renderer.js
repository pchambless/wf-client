import React, { useMemo } from 'react';
import { Grid, Box } from '@mui/material';
import createLogger from '../../../utils/logger';
import Select from '../../../components/page/Select';
import TextField from '@mui/material/TextField';

const FormFieldRenderer = ({ 
  visibleFields = [], 
  formData = {}, 
  handleInputChange, 
  loading, 
  error    
}) => {
  const log = createLogger('FormField.Renderer');
  
  // Debug what's coming in
  log.debug('Rendering form fields:', { 
    fieldCount: visibleFields.length,
    formDataFields: Object.keys(formData),
    formData
  });
  
  // IMPORTANT: Move all hooks to the top level, before any conditionals
  
  // Group fields by their group attribute
  const fieldGroups = useMemo(() => {
    const groups = {};
    
    visibleFields.forEach(field => {
      const groupName = field.group || 'default';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(field);
    });
    
    return groups;
  }, [visibleFields]);
  
  // Render a single field based on its type
  const renderField = useMemo(() => (field, index) => {
    const { id, label, list } = field;
    const fieldId = id || `anonymous-field-${index}`;  // Ensure ID is never undefined
    const fieldValue = formData[fieldId] || '';
    
    if (list) {
      log.debug(`Rendering select field: ${fieldId} (list: ${list})`);
      return (
        <Grid item xs={12} sm={6} key={`field-${fieldId}-${index}`}>
          <Select
            placeholder={label}
            value={fieldValue}
            onChange={(newValue) => handleInputChange(fieldId, newValue)}
            listName={list}
            sx={{ mb: 2 }}
          />
        </Grid>
      );
    }
    
    log.debug(`Field ${fieldId}:`, {
      hasValue: fieldValue !== undefined,
      value: fieldValue,
      defaultValue: field.defaultValue
    });

    return (
      <Grid item xs={12} sm={6} key={`field-${fieldId}-${index}`}>
        <TextField
          fullWidth
          margin="normal"
          id={fieldId}
          name={fieldId}
          label={label}
          value={fieldValue || ''}
          onChange={(e) => handleInputChange(fieldId, e.target.value)}
          disabled={loading}
          error={error && error[fieldId]}
          helperText={error && error[fieldId] ? error[fieldId] : ''}
        />
      </Grid>
    );
  }, [formData, handleInputChange, loading, error, log]);

  // Render all groups with proper keys
  return (
    <>
      {Object.entries(fieldGroups).map(([groupName, fields], groupIndex) => (
        <Grid container spacing={2} key={`group-${groupName}-${groupIndex}`}>
          {fields.map((field, fieldIndex) => renderField(field, fieldIndex))}
        </Grid>
      ))}
      {error && (
        <Box sx={{ color: 'error.main', mt: 2 }}>
          {error}
        </Box>
      )}
    </>
  );
};

export default React.memo(FormFieldRenderer);
