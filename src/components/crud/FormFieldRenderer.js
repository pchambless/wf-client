import React from 'react';
import { Grid, TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import createLogger from '../../utils/logger';
import { getRefDataByName } from '../../stores'; // Changed from getReferenceData

const log = createLogger('FormFieldRenderer');

const FormFieldRenderer = ({ visibleFields, formData, handleInputChange, loading, error }) => {
  // Log what's being rendered
  log('Rendering fields:', { 
    fieldCount: visibleFields?.length || 0,
    formData: formData || {},
    hasData: Object.keys(formData || {}).length > 0
  });

  // Early return if no fields
  if (!visibleFields || visibleFields.length === 0) {
    return null;
  }

  const renderField = (fieldConfig) => {
    // Get current value for this field
    const fieldValue = formData?.[fieldConfig.field] || '';
    
    // Determine if field is required
    const isRequired = fieldConfig.required || false;
    
    // Log complete field config to debug issues
    log('Rendering field', { 
      field: fieldConfig.field, 
      label: fieldConfig.label,
      dataType: fieldConfig.dataType,
      fieldType: fieldConfig.fieldType,
      selList: fieldConfig.selList,
      value: fieldValue
    });

    // Check field type in a clear if-else if-else chain
    
    // 1. First check for select fields (by selList)
    if (fieldConfig.selList || fieldConfig.listName) {
      log('Rendering Select field for', fieldConfig.field);
      return renderSelectField(fieldConfig, fieldValue, handleInputChange, loading, error, isRequired);
    } 
    // 2. Then check for date fields
    else if (
      fieldConfig.dataType === 'DATE' || 
      fieldConfig.dataType === 'Date' ||
      fieldConfig.fieldType === 'date' ||
      fieldConfig.fieldType === 'DATE' ||
      (fieldConfig.field && fieldConfig.field.toLowerCase().includes('date'))
    ) {
      log('Rendering DatePicker for', fieldConfig.field);
      return renderDateField(fieldConfig, fieldValue, handleInputChange, loading, isRequired);
    } 
    // 3. Then check for multiline text fields
    else if (fieldConfig.label === 'Description' || fieldConfig.label === 'Comments') {
      log('Rendering multiline TextField for', fieldConfig.field);
      return renderTextareaField(fieldConfig, fieldValue, handleInputChange, loading, isRequired);
    } 
    // 4. Default case: regular text field
    else {
      log('Rendering regular TextField for', fieldConfig.field);
      return renderTextField(fieldConfig, fieldValue, handleInputChange, loading, isRequired);
    }
  };

  const renderSelectField = (fieldConfig, fieldValue, handleInputChange, loading, error, isRequired) => {
    // Get list name from field configuration
    const listName = fieldConfig.listName || fieldConfig.selList;
    
    if (!listName) {
      log.warn(`No list name specified for select field: ${fieldConfig.field}`);
      return renderTextField(fieldConfig, fieldValue, handleInputChange, loading, isRequired);
    }
    
    // Get options using the getRefDataByName function
    const options = getRefDataByName(listName) || [];
    
    // If no options, render a disabled text field
    if (!options.length) {
      log.warn(`No options found for select field ${fieldConfig.field} with list ${listName}`);
      return renderTextField({
        ...fieldConfig,
        disabled: true,
        helperText: `No ${listName} options available`
      }, fieldValue, handleInputChange, loading, isRequired);
    }
    
    // Smart field detection - examine the first item to find ID and name fields
    const firstItem = options[0];
    const fields = Object.keys(firstItem);
    
    // Try to find ID field - common patterns in your data
    let idField = null;
    const possibleIdFields = [
      `${listName.replace('List', 'ID')}`,          // measList -> measID
      `${listName.replace('List', '')}ID`,          // vndrList -> vndrID
      'id', 'ID', '_id', 'key', 'value',            // Common names
      ...fields.filter(f => f.toLowerCase().includes('id')) // Any field with "id"
    ];
    
    for (const field of possibleIdFields) {
      if (fields.includes(field) && firstItem[field] !== undefined) {
        idField = field;
        break;
      }
    }
    
    // Try to find name field - common patterns in your data
    let nameField = null;
    const possibleNameFields = [
      `${listName.replace('List', 'Name')}`,        // measList -> measName
      `${listName.replace('List', '')}Name`,        // vndrList -> vndrName
      'name', 'NAME', 'label', 'title', 'text',     // Common names
      'description', 'desc',                        // Alternatives
      ...fields.filter(f => f.toLowerCase().includes('name')) // Any field with "name"
    ];
    
    for (const field of possibleNameFields) {
      if (fields.includes(field) && firstItem[field] !== undefined) {
        nameField = field;
        break;
      }
    }
    
    // Override with explicit configuration if provided
    if (fieldConfig.idField) idField = fieldConfig.idField;
    if (fieldConfig.nameField) nameField = fieldConfig.nameField;
    
    // If we still don't have an ID field, use the first field
    if (!idField && fields.length > 0) {
      idField = fields[0];
    }
    
    // If we still don't have a name field, use the second field or fall back to the ID field
    if (!nameField && fields.length > 1) {
      nameField = fields[1];
    } else if (!nameField) {
      nameField = idField;
    }
    
    log(`Select field ${fieldConfig.field} using ${listName}:`, {
      detectedIdField: idField,
      detectedNameField: nameField,
      sample: `${firstItem[idField]} - ${firstItem[nameField]}`,
      optionCount: options.length
    });
    
    return (
      <FormControl fullWidth margin="normal">
        <InputLabel>{fieldConfig.label}{isRequired ? ' *' : ''}</InputLabel>
        <MuiSelect
          value={fieldValue || ''}
          onChange={(e) => handleInputChange(fieldConfig.field, e.target.value, fieldConfig)}
          label={`${fieldConfig.label}${isRequired ? ' *' : ''}`}
          disabled={loading}
          error={!!error && !fieldValue && isRequired}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {options.map((option) => {
            const id = option[idField];
            const name = option[nameField];
            
            return (
              <MenuItem 
                key={`${id || Math.random()}`} 
                value={id}
              >
                {name !== undefined ? name : `[${id}]`}
              </MenuItem>
            );
          })}
        </MuiSelect>
      </FormControl>
    );
  };

  const renderDateField = (fieldConfig, fieldValue, handleInputChange, loading, isRequired) => {
    log('Date field value:', { 
      field: fieldConfig.field,
      value: fieldValue,
      valueType: typeof fieldValue
    });

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label={fieldConfig.label}
          value={fieldValue ? new Date(fieldValue) : null}
          onChange={(date) => {
            const formattedDate = date ? date.toISOString().split('T')[0] : null;
            log('Date changed:', { 
              field: fieldConfig.field, 
              oldValue: fieldValue, 
              newValue: formattedDate 
            });
            handleInputChange(fieldConfig.field, formattedDate, fieldConfig);
          }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              fullWidth 
              margin="normal"
              disabled={loading}
              required={isRequired}
              error={!!error && !fieldValue && isRequired}
            />
          )}
        />
      </LocalizationProvider>
    );
  };

  const renderTextareaField = (fieldConfig, fieldValue, handleInputChange, loading, isRequired) => {
    // Ensure we have a string
    const safeValue = fieldValue != null ? String(fieldValue) : '';
    
    return (
      <TextField
        label={fieldConfig.label}
        value={safeValue}
        onChange={(e) => handleInputChange(fieldConfig.field, e.target.value, fieldConfig)}
        fullWidth
        multiline
        rows={4}
        margin="normal"
        disabled={loading}
        required={isRequired}
        error={!!error && !safeValue && isRequired}
        helperText={fieldConfig.helperText}
      />
    );
  };

  const renderTextField = (fieldConfig, fieldValue, handleInputChange, loading, isRequired) => {
    // Ensure we have a string
    const safeValue = fieldValue != null ? String(fieldValue) : '';
    
    return (
      <TextField
        label={fieldConfig.label}
        value={safeValue}
        onChange={(e) => handleInputChange(fieldConfig.field, e.target.value, fieldConfig)}
        fullWidth
        margin="normal"
        disabled={loading}
        required={isRequired}
        error={!!error && !safeValue && isRequired}
        helperText={fieldConfig.helperText}
      />
    );
  };

  return (
    <Grid container spacing={2}>
      {visibleFields.map(field => (
        <Grid 
          item 
          xs={12} 
          sm={field.width === 'full' ? 12 : 6}
          key={field.field}
        >
          {renderField(field)}
        </Grid>
      ))}
    </Grid>
  );
};

export default FormFieldRenderer;
