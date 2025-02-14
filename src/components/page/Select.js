import React, { useState, useCallback, useEffect } from 'react';
import { getVar, setVars } from '../../utils/externalStore';
import { fetchData } from '../../utils/dataFetcher';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, CircularProgress, Typography } from '@mui/material';

const Select = ({ eventType, placeholder, onChange, params }) => {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(getVar(':' + eventType) || '');
  const [valueKey, setValueKey] = useState('');
  const [labelKey, setLabelKey] = useState('');
  const [varName, setVarName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchData(eventType, params);
      console.log(`Fetched options for ${eventType}:`, response); // Log the fetched data
      if (response.length > 0) {
        const keys = Object.keys(response[0]);
        setValueKey(keys[0]);
        setLabelKey(keys[1]);
        setVarName(keys[0]); // Set the variable name based on the first column name
      }
      setOptions(response);
    } catch (error) {
      console.error(`Error fetching options for ${eventType}:`, error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [eventType, params]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
    setVars({ [':' + varName]: value }); // Prefix the variable name with a ":"

    if (onChange) onChange(value);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error fetching options: {error}</Typography>;
  }

  return (
    <FormControl fullWidth>
      <InputLabel id={`${varName}-label`}>{placeholder}</InputLabel>
      <MuiSelect
        labelId={`${varName}-label`}
        id={varName}
        value={selectedValue}
        label={placeholder}
        onChange={handleChange}
      >
        <MenuItem value="" disabled>{placeholder}</MenuItem>
        {options.map((option) => (
          <MenuItem key={option[valueKey]} value={option[valueKey]}>
            {option[labelKey]}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
};

export default Select;
