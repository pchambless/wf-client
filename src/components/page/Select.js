import React, { useState, useEffect } from 'react';
import { FormControl } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField'; // Use the default TextField component

const Select = ({ placeholder, onChange, value, options, sx }) => {
  const [selectedValue, setSelectedValue] = useState(value || '');
  const [valueKey, setValueKey] = useState('');
  const [labelKey, setLabelKey] = useState('');

  useEffect(() => {
    if (options.length > 0) {
      const keys = Object.keys(options[0]);
      setValueKey(keys[0]);
      setLabelKey(keys[1]);
    }
  }, [options]);

  useEffect(() => {
    setSelectedValue(value || '');
  }, [value]);

  const handleChange = (event, value) => {
    const selectedOption = options.find(option => option[labelKey] === value);
    const selectedValue = selectedOption ? selectedOption[valueKey] : '';
    setSelectedValue(selectedValue);

    if (onChange) onChange(selectedValue);
  };

  return (
    <FormControl fullWidth>
      <Autocomplete
        options={options.map(option => option[labelKey])}
        value={options.find(option => option[valueKey] === selectedValue)?.[labelKey] || ''}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label={placeholder}
            variant="outlined"
            sx={sx}
          />
        )}
      />
    </FormControl>
  );
};

export default Select;
