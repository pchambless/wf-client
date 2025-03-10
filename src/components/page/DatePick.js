import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Import as named export
import { getVar, setVars } from '../../utils/externalStore';
import createLogger from '../../utils/logger'; // Import the createLogger function
import TextField from '@mui/material/TextField'; // Use the default TextField component

const log = createLogger('DatePick'); // Create a logger for the DatePick component

const DatePick = ({ placeholder, onChange, value, varName, required, sx }) => {
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : getVar(varName) ? new Date(getVar(varName)) : null);
  const [loading] = useState(false);
  const [error] = useState(null);

  useEffect(() => {
    log('value:', value, 'varName:', varName);
    setSelectedDate(value ? new Date(value) : getVar(varName) ? new Date(getVar(varName)) : null);
  }, [value, varName]);

  const handleChange = (date) => {
    setSelectedDate(date);
    log('varName:', varName, ' Selected date:', date);
    setVars({ [varName]: date });

    if (onChange) onChange(date);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={placeholder}
        value={selectedDate}
        onChange={handleChange}
        inputFormat="yyyy-MM-dd" // Set the date format
        renderInput={(params) => (
          <TextField
            {...params}
            required={required}
            error={!!error}
            sx={sx}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default DatePick;
