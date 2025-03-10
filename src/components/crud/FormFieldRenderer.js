import React, { useEffect } from 'react';
import { TextField, Grid, Paper, Typography, InputBase } from '@mui/material';
import DatePick from '../page/DatePick';
import Select from '../page/Select';
import { getCachedList } from '../../utils/acctLists';
import createLogger from '../../utils/logger';

const log = createLogger('FormFieldRenderer');

// Custom multiline text field component that avoids styling issues
const CustomMultilineTextField = ({ fieldConfig, fieldValue, handleInputChange, loading, error, isRequired }) => {
  log('Rendering custom multiline field', {
    field: fieldConfig.field,
    value: fieldValue,
    valueType: typeof fieldValue
  });
  
  // Force stringify the value to ensure it's treated as text
  const safeValue = fieldValue != null ? String(fieldValue) : '';
  
  return (
    <Paper 
      elevation={0} 
      variant="outlined"
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        mb: 1,
        pt: 0,
        bgcolor: 'white',
        // Fixed height for consistent appearance
        height: '96px', // This should accommodate 3 lines of text + padding
      }}
    >
      <Typography 
        variant="caption" 
        component="label"
        sx={{ 
          position: 'absolute',
          top: -10,
          left: 10,
          px: 0.5,
          // Increase padding to ensure text is fully visible
          py: 0.2,
          // Ensure background extends beyond text
          bgcolor: 'white',
          // Add a border that matches the background color to create a buffer area
          border: '1px solid white',
          // Add shadow effect to make the text stand out
          boxShadow: '0 0 0 1px white',
          // Set z-index to ensure label appears above the field border
          zIndex: 1,
          color: error && !safeValue && isRequired ? 'error.main' : 'text.secondary',
          fontWeight: isRequired ? 500 : 400
        }}
      >
        {fieldConfig.label}{isRequired ? ' *' : ''}
      </Typography>
      
      <InputBase
        fullWidth
        multiline
        // Use only rows prop, not minRows/maxRows
        rows={3}
        value={safeValue}
        onChange={(e) => {
          const newValue = e.target.value;
          log(`${fieldConfig.label} field changed:`, { oldValue: fieldValue, newValue });
          handleInputChange(fieldConfig.field, newValue, fieldConfig);
        }}
        disabled={loading}
        sx={{
          p: 1.5,
          height: '100%',
          bgcolor: 'white',
          '& textarea': {
            height: '72px !important', // Fixed height for exactly 3 rows
            overflow: 'auto',
            bgcolor: 'white'
          },
          '&.Mui-focused': {
            bgcolor: 'white'
          }
        }}
      />
      
      {fieldConfig.helperText && (
        <Typography variant="caption" color="text.secondary" sx={{ px: 1.5, pb: 1 }}>
          {fieldConfig.helperText}
        </Typography>
      )}
    </Paper>
  );
};

/**
 * Renders a single form field based on field configuration
 */
const renderField = (fieldConfig, fieldValue, handleInputChange, loading, error, isRequired) => {
  // Log complete field config to debug issues
  log('Rendering field', { 
    field: fieldConfig.field, 
    label: fieldConfig.label,
    dataType: fieldConfig.dataType,
    fieldType: fieldConfig.fieldType,
    value: fieldValue
  });

  // Check field type in a clear if-else if-else chain
  
  // 1. First check for select fields
  if (fieldConfig.selList) {
    log('Rendering Select field for', fieldConfig.field);
    return (
      <Select
        placeholder={fieldConfig.label}
        onChange={(value) => handleInputChange(fieldConfig.field, value, fieldConfig)}
        value={fieldValue}
        disabled={loading}
        required={isRequired}
        error={!!error && !fieldValue}
        options={getCachedList(fieldConfig.selList) || []}
      />
    );
  } 
  // 2. Then check for date fields
  else if (
    fieldConfig.dataType === 'DATE' || 
    fieldConfig.dataType === 'Date' ||
    fieldConfig.fieldType === 'date' ||
    fieldConfig.fieldType === 'DATE' ||
    fieldConfig.field.toLowerCase().includes('date')
  ) {
    log('Rendering DatePicker for', fieldConfig.field);
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
  // 3. Then check for multiline text fields
  else if (fieldConfig.label === 'Description' || fieldConfig.label === 'Comments') {
    log('Rendering multiline TextField for', fieldConfig.field);
    return (
      <CustomMultilineTextField
        fieldConfig={fieldConfig}
        fieldValue={fieldValue}
        handleInputChange={handleInputChange}
        loading={loading}
        error={error}
        isRequired={isRequired}
      />
    );
  } 
  // 4. Default case: regular text field
  else {
    log('Rendering regular TextField for', fieldConfig.field);
    const safeValue = fieldValue != null ? String(fieldValue) : '';
    
    return (
      <TextField
        fullWidth
        label={fieldConfig.label}
        name={fieldConfig.field}
        value={safeValue}
        onChange={(e) => handleInputChange(fieldConfig.field, e.target.value, fieldConfig)}
        disabled={loading}
        required={isRequired}
        error={!!error && !safeValue}
        helperText={fieldConfig.helperText}
      />
    );
  }
};

/**
 * Renders all form fields based on page configuration
 */
const FormFieldRenderer = ({ visibleFields, formData, handleInputChange, loading, error }) => {
  // Log the entire incoming data to debug
  useEffect(() => {
    log('FormFieldRenderer received data', { 
      visibleFields: visibleFields.map(field => ({
        field: field.field,
        label: field.label,
        dataType: field.dataType,
        fieldType: field.fieldType,
        isDate: field.dataType === 'DATE' || 
                field.dataType === 'Date' || 
                field.fieldType === 'date' || 
                field.fieldType === 'DATE' ||
                (field.field && field.field.toLowerCase().includes('date'))
      })),
      formDataKeys: Object.keys(formData)
    });
    
    // Specifically check for Description and Comments fields
    const descField = visibleFields.find(f => f.label === 'Description');
    const commentsField = visibleFields.find(f => f.label === 'Comments');
    
    if (descField) {
      log('Description field found:', {
        fieldName: descField.field,
        valueInFormData: formData[descField.field],
        valueExists: descField.field in formData,
        valueType: typeof formData[descField.field]
      });
    }
    
    if (commentsField) {
      log('Comments field found:', {
        fieldName: commentsField.field,
        valueInFormData: formData[commentsField.field],
        valueExists: commentsField.field in formData,
        valueType: typeof formData[commentsField.field]
      });
    }
  }, [visibleFields, formData]);

  return (
    <Grid container spacing={2}>
      {visibleFields.map((field) => {
        // Determine if this field should occupy full width (Description/Comments)
        const isFullWidth = field.label === 'Description' || field.label === 'Comments';
        
        // Make sure we're handling the field value correctly, especially for multiline fields
        let fieldValue = formData[field.field];
        if ((field.label === 'Description' || field.label === 'Comments') && fieldValue != null) {
          // Ensure multiline field values are strings
          fieldValue = String(fieldValue);
          log(`Processing ${field.label} value:`, { 
            original: formData[field.field], 
            processed: fieldValue,
            fieldName: field.field
          });
        }
        
        const isRequired = field.required === 1 || field.required === undefined;
        
        // Debug log to identify DATE fields
        if (field.dataType === 'DATE' || field.fieldType === 'date') {
          log('Found DATE field', { field: field.field, dataType: field.dataType, fieldType: field.fieldType });
        }
        
        return (
          <Grid item xs={12} sm={isFullWidth ? 12 : 6} key={field.field}>
            {renderField(field, fieldValue, handleInputChange, loading, error, isRequired)}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default FormFieldRenderer;
