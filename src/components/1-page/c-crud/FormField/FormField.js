import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  FormControl,
  FormHelperText,
  FormControlLabel,
  Checkbox,
  Switch,
  Typography,
  RadioGroup,
  Radio,
  Box,
  Select as MuiSelect,
  MenuItem,
  InputLabel
} from '@mui/material';
// Replace the custom Select import with MUI Select
// import Select from '@2-form/Select'; 
import createLogger from '@utils/logger';
import { observer } from 'mobx-react-lite';

const log = createLogger('FormField');

/**
 * Renders a single form field with appropriate input component 
 * based on field type
 */
const FormField = observer(({
  field,
  value,
  onChange,
  error,
  disabled
}) => {
  // Add error state since it seems to be referenced
  const [localError, setLocalError] = useState(error || null);
  const [internalValue, setInternalValue] = useState(value);

  // Common dense styles for all field types
  const commonSx = {
    '& .MuiInputBase-root': {
      // Make input fields shorter in height
      marginY: 0.5,
    },
    '& .MuiInputLabel-root': {
      // Make labels smaller
      fontSize: '0.9rem',
      transform: 'translate(14px, 12px) scale(1)',
      '&.MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.75)'
      }
    },
    '& .MuiOutlinedInput-notchedOutline': {
      // Less prominent border
      borderWidth: 1
    }
  };

  // Sync with external value
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Update local error when prop changes
  useEffect(() => {
    setLocalError(error);
  }, [error]);

  // Handle field change
  const handleChange = (e) => {
    let newValue;
    
    switch (field.type) {
      case 'checkbox':
      case 'switch':
        newValue = e.target.checked;
        break;
      case 'number':
        newValue = e.target.value === '' ? '' : Number(e.target.value);
        break;
      default:
        newValue = e.target.value;
    }
    
    setInternalValue(newValue);
    
    // Clear error when field is changed
    if (localError) {
      setLocalError(null);
    }
    
    onChange(newValue);
  };
  
  // Handle special case for select fields with empty options
  if (field.type === 'select' && (!field.options || !Array.isArray(field.options))) {
    log.warn(`Select field ${field.id} has no options array`, { field });
    
    // Fallback to text input
    return (
      <TextField
        fullWidth
        type="text"
        size="small"
        label={field.label || field.id}
        value={internalValue || ''}
        onChange={handleChange}
        error={!!localError}
        helperText={localError || (field.helperText || 'No options available')}
        disabled={disabled}
        placeholder="No options available"
        sx={commonSx}
      />
    );
  }

  // Render field based on type
  switch (field.type) {
    case 'select':
      return (
        <FormControl 
          fullWidth 
          error={!!localError}
          disabled={disabled}
          margin="normal"
          size="small"
        >
          <InputLabel id={`label-${field.id}`}>{field.label}</InputLabel>
          <MuiSelect
            labelId={`label-${field.id}`}
            id={field.id}
            value={value || ''}
            label={field.label}
            onChange={handleChange}
          >
            {!field.required && (
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
            )}
            
            {(field.options || field.selList || []).map(option => {
              // Handle different option formats
              const optionValue = option.id !== undefined ? option.id : 
                                option.value !== undefined ? option.value : option;
              const optionLabel = option.name !== undefined ? option.name : 
                                option.label !== undefined ? option.label : option;
                                
              return (
                <MenuItem key={optionValue} value={optionValue}>
                  {optionLabel}
                </MenuItem>
              );
            })}
          </MuiSelect>
          {localError && <FormHelperText>{localError}</FormHelperText>}
        </FormControl>
      );
      
    case 'checkbox':
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={!!internalValue}
              onChange={handleChange}
              disabled={disabled}
            />
          }
          label={field.label || field.id}
          disabled={disabled}
        />
      );
      
    case 'switch':
      return (
        <FormControlLabel
          control={
            <Switch
              checked={!!internalValue}
              onChange={handleChange}
              disabled={disabled}
            />
          }
          label={field.label || field.id}
          disabled={disabled}
        />
      );
      
    case 'radio':
      return (
        <FormControl fullWidth error={!!localError} disabled={disabled}>
          <Typography variant="subtitle2">{field.label || field.id}</Typography>
          <RadioGroup 
            value={internalValue || ''} 
            onChange={handleChange}
            row={field.row || false}
          >
            {field.options?.map((option, index) => (
              <FormControlLabel
                key={option.value || option.id || index}
                value={option.value || option.id || option}
                control={<Radio />}
                label={option.label || option.name || option.value || option.id || option}
              />
            ))}
          </RadioGroup>
          {(localError || field.helperText) && (
            <FormHelperText>{localError || field.helperText}</FormHelperText>
          )}
        </FormControl>
      );
      
    case 'number':
      return (
        <TextField
          fullWidth
          type="number"
          size="small"
          label={field.label || field.id}
          value={internalValue || ''}
          onChange={handleChange}
          error={!!localError}
          helperText={localError || (field.helperText || '')}
          disabled={disabled}
          InputProps={{
            inputProps: {
              min: field.min,
              max: field.max,
              step: field.step || 1
            }
          }}
          sx={commonSx}
          margin="dense"
        />
      );
      
    case 'textarea':
      return (
        <TextField
          fullWidth
          multiline
          rows={field.rows || 4}
          label={field.label || field.id}
          value={internalValue || ''}
          onChange={handleChange}
          error={!!localError}
          helperText={localError || (field.helperText || '')}
          disabled={disabled}
          size="small"
          sx={commonSx}
          margin="dense"
        />
      );
      
    // Default to text input
    default:
      return (
        <TextField
          fullWidth
          type={field.type || 'text'}
          size="small"
          label={field.label || field.id}
          value={internalValue || ''}
          onChange={handleChange}
          error={!!localError}
          helperText={localError || (field.helperText || '')}
          disabled={disabled}
          sx={commonSx}
          margin="dense"
        />
      );
  }
});

// Look for how fields are arranged in the form:

// Inside your main form container:
const FormContainer = ({ fields, values, handleFieldChange, disabled }) => (
  <Box 
    component="form"
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 2,
      width: '100%'
    }}
  >
    {fields.map(field => (
      <Box
        key={field.field}
        sx={{
          // This will make multiline fields take entire row
          // when combined with the gridColumn CSS in the Renderer
          gridColumn: field.displayType === 'multiLine' ? '1 / -1' : 'auto'
        }}
      >
        <FormField
          field={field}
          value={values[field.field]}
          onChange={handleFieldChange}
          disabled={disabled}
        />
      </Box>
    ))}
  </Box>
);

export default FormField;
export { FormContainer };
