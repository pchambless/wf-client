import React, { useMemo } from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FormFieldPresenter } from './Presenter';
import createLogger from '../../../utils/logger';

const FormFieldRenderer = ({ visibleFields, formData, handleInputChange, loading, error }) => {
  const theme = useTheme();
  const log = createLogger('FormFieldRenderer');
  const presenter = useMemo(() => new FormFieldPresenter(), []);

  const renderSelect = (fieldConfig) => {
    const options = presenter.getSelectOptions(fieldConfig);
    const value = formData[fieldConfig.field] || '';

    log.debug('Select field details:', {
      field: fieldConfig.field,
      listName: fieldConfig.selList,
      value,
      optionsCount: options.length,
      options: options.map(o => ({ value: o.value, label: o.label })),
      rawValue: formData[fieldConfig.field],
    });

    // Validate value exists in options
    const isValidValue = value === '' || options.some(o => o.value === Number(value));
    
    if (!isValidValue) {
      log.warn('Invalid select value:', {
        field: fieldConfig.field,
        value,
        availableValues: options.map(o => o.value)
      });
    }

    return (
      <FormControl 
        fullWidth
        error={!isValidValue && error}
        required={Boolean(fieldConfig.required)}
        disabled={loading}
      >
        <InputLabel>{fieldConfig.label}</InputLabel>
        <Select
          value={isValidValue ? value : ''}
          onChange={(e) => handleInputChange(fieldConfig.field, e.target.value)}
          label={fieldConfig.label}
        >
          <MenuItem key={`${fieldConfig.field}-none`} value="">
            <em>None</em>
          </MenuItem>
          {options.map(opt => {
            // Convert option value to number for comparison
            const optValue = Number(opt.value);
            return (
              <MenuItem 
                key={`${fieldConfig.field}-${optValue}`} 
                value={optValue}
              >
                {opt.label || `${optValue}`}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  };

  const renderField = (fieldConfig) => {
    const fieldValue = formData?.[fieldConfig.field] || '';
    const fieldType = presenter.getFieldType(fieldConfig);
    const isValid = presenter.validateField(fieldConfig, fieldValue);
    const styles = presenter.getFieldStyles(fieldConfig, theme);

    switch (fieldType) {
      case 'select':
        return renderSelect(fieldConfig);
      case 'multiline':
      case 'text':
      default:
        return (
          <TextField
            sx={styles}
            fullWidth
            label={fieldConfig.label}
            value={fieldValue}
            onChange={(e) => handleInputChange(fieldConfig.field, e.target.value)}
            error={!isValid && error}
            required={fieldConfig.required}
            disabled={loading}
            multiline={fieldType === 'multiline'}
            minRows={fieldType === 'multiline' ? 4 : 1}
            maxRows={fieldType === 'multiline' ? 8 : 1}
            variant="outlined"
          />
        );
    }
  };

  return (
    <Grid container spacing={1}>
      {visibleFields?.map(field => (
        <Grid item {...presenter.getGridConfig(field)} key={field.field}>
          {renderField(field)}
        </Grid>
      ))}
    </Grid>
  );
};

export default FormFieldRenderer;
