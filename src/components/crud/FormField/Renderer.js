import React from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import createLogger from '../../../utils/logger';

// Use logger consistently
const logger = createLogger('FormField.Renderer');

class FormFieldRenderer {
  constructor() {
    this.logger = createLogger('FormField.Renderer');
  }

  renderField(field, value, onChange, disabled = false) {
    // Use displayType directly without destructuring unused variables
    const { displayType } = field;
    
    switch (displayType) {
      case 'multiLine':
        return this.renderMultilineField(field, value, onChange, disabled);
      
      case 'select':
        return this.renderSelectField(field, value, onChange, disabled);
        
      case 'number':
        return this.renderNumberField(field, value, onChange, disabled);
      
      default:
        return this.renderTextField(field, value, onChange, disabled);
    }
  }
  
  renderMultilineField(field, value, onChange, disabled) {
    return (
      <TextField
        fullWidth
        multiline
        minRows={3}
        maxRows={8}
        label={field.label}
        value={value || ''}
        onChange={onChange}
        required={field.required}
        disabled={disabled}
        sx={{
          '& .MuiInputBase-root': {
            height: 'auto',
            minHeight: '100px'
          }
        }}
      />
    );
  }
  
  renderTextField(field, value, onChange, disabled) {
    return (
      <TextField
        fullWidth
        label={field.label}
        value={value || ''}
        onChange={onChange}
        required={field.required}
        disabled={disabled}
      />
    );
  }
  
  renderNumberField(field, value, onChange, disabled) {
    return (
      <TextField
        fullWidth
        type="number"
        label={field.label}
        value={value || ''}
        onChange={onChange}
        required={field.required}
        disabled={disabled}
      />
    );
  }
  
  renderSelectField(field, value, onChange, disabled) {
    const { required, label, selList } = field;
    
    return (
      <FormControl fullWidth required={required} disabled={disabled}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value || ''}
          onChange={onChange}
          label={label}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {selList && selList.map(item => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

export default FormFieldRenderer;
