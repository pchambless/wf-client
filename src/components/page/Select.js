import React, { useState, useCallback, useEffect } from 'react';
import { getVar, setVars } from '../../utils/externalStore';
import { FormControl, TextField, CircularProgress, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useEventTypeContext } from '../../context/EventTypeContext'; // Use useEventTypeContext

const Select = ({ eventType, placeholder, onChange, value }) => {
  const { execEvent } = useEventTypeContext(); // Use execEvent from useEventTypeContext
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState(value || getVar(':' + eventType) || '');
  const [valueKey, setValueKey] = useState('');
  const [labelKey, setLabelKey] = useState('');
  const [varName, setVarName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await execEvent(eventType);
      console.log(`Fetched options for ${eventType}:`, response); // Log the fetched data
      if (response.length > 0) {
        const keys = Object.keys(response[0]);
        setValueKey(keys[0]);
        setLabelKey(keys[1]);
        setVarName(keys[0]); // Set the variable name based on the first column name
        setOptions([{ [keys[0]]: '', [keys[1]]: 'None' }, ...response]); // Add default 'None' option
      }
    } catch (error) {
      console.error(`Error fetching options for ${eventType}:`, error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [eventType, execEvent]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    setSelectedValue(value || getVar(':' + eventType) || '');
  }, [value, eventType]);

  const handleChange = (event, value) => {
    const selectedOption = options.find(option => option[labelKey] === value);
    const selectedValue = selectedOption ? selectedOption[valueKey] : '';
    setSelectedValue(selectedValue);
    setVars({ [':' + varName]: selectedValue }); // Prefix the variable name with a ":"

    if (onChange) onChange(selectedValue);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error fetching options: {error}</Typography>;
  }

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
          />
        )}
      />
    </FormControl>
  );
};

export default Select;
