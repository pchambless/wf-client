import React, { useEffect, useMemo, useCallback, useRef } from 'react';
import { FormControl } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import createLogger from '../../utils/logger';
import { getVar } from '../../utils/externalStore';

const Select = ({ 
  placeholder, 
  onChange, 
  value, 
  options: directOptions = [], 
  listName = null,
  sx 
}) => {
  const log = createLogger('Select');
  const renderCountRef = useRef(0);
  
  // Memoize options to prevent recreation on each render
  const options = useMemo(() => {
    return listName ? (getVar(`:${listName}`) || []) : directOptions;
  }, [listName, directOptions]);
  
  // Don't use setState for selected value as it causes re-renders
  const selectedValue = value || '';
  
  // Extract first option for dependency check
  const firstOption = useMemo(() => options[0] || null, [options]);
  const optionsLength = useMemo(() => options.length, [options]);
  
  // Only log once on mount or when critical deps change
  useEffect(() => {
    log.debug(`Select options for ${listName || 'direct'}:`, {
      count: optionsLength,
      first: firstOption ? JSON.stringify(firstOption) : 'none',
      currentValue: value,
      renderCount: ++renderCountRef.current
    });
    
    if (listName && optionsLength === 0) {
      log.error(`No options found for list: ${listName}`);
    }
  }, [optionsLength, listName, log, firstOption, value]);

  // Simple key detection - assumes consistent data structure
  const valueKey = useMemo(() => {
    if (optionsLength === 0) return 'id';
    return firstOption && firstOption.id !== undefined ? 'id' : 
           firstOption ? Object.keys(firstOption)[0] : 'id';
  }, [optionsLength, firstOption]);
  
  const labelKey = useMemo(() => {
    if (optionsLength === 0) return 'name';
    return firstOption && firstOption.name !== undefined ? 'name' : 
           firstOption ? (Object.keys(firstOption)[1] || Object.keys(firstOption)[0]) : 'name';
  }, [optionsLength, firstOption]);

  const handleChange = useCallback((event, value) => {
    if (!onChange) return;
    
    const selectedOption = options.find(option => option[labelKey] === value);
    const newValue = selectedOption ? selectedOption[valueKey] : '';
    onChange(newValue);
  }, [options, labelKey, valueKey, onChange]);

  // Find the label for the current value with safeguards
  const currentLabel = useMemo(() => {
    const found = options.find(option => 
      option && option[valueKey] !== undefined && 
      String(option[valueKey]) === String(selectedValue)
    );
    return found ? found[labelKey] || '' : '';
  }, [options, selectedValue, valueKey, labelKey]);

  // Stable option array for Autocomplete
  const autoCompleteOptions = useMemo(() => {
    return optionsLength > 0 ? options.map(option => option[labelKey]) : [];
  }, [options, labelKey, optionsLength]);

  // Stable comparison function
  const isOptionEqualToValue = useCallback((option, value) => {
    if (!value || value === '') return true;
    return option === value;
  }, []);

  return (
    <FormControl fullWidth>
      <Autocomplete
        disablePortal
        options={autoCompleteOptions}
        value={currentLabel}
        onChange={handleChange}
        isOptionEqualToValue={isOptionEqualToValue}
        renderInput={(params) => (
          <TextField
            {...params}
            label={placeholder}
            variant="outlined"
            sx={sx}
            error={listName && optionsLength === 0}
            helperText={listName && optionsLength === 0 ? `No options for ${listName}` : ''}
          />
        )}
      />
    </FormControl>
  );
};

export default React.memo(Select);
