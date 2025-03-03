import React, { useState, useEffect } from 'react';
import { TextField, CircularProgress, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { getVar, setVars } from '../../utils/externalStore';
import useLogger from '../../hooks/useLogger'; // Import useLogger

const DatePick = ({ placeholder, onChange, value, varName }) => {
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : getVar(varName) ? new Date(getVar(varName)) : null);
  const [loading] = useState(false);
  const [error] = useState(null);
  const log = useLogger('DatePick');

  useEffect(() => {
    log('value:', value, 'varName:', varName);
    setSelectedDate(value ? new Date(value) : getVar(varName) ? new Date(getVar(varName)) : null);
  }, [value, varName, log]);

  const handleChange = (date) => {
    setSelectedDate(date);
    log('varName:', varName, ' Selected date:', date);
    setVars({ [varName]: date });

    if (onChange) onChange(date);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <DatePicker
      label={placeholder}
      value={selectedDate}
      onChange={handleChange}
      renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
    />
  );
};

export default DatePick;
