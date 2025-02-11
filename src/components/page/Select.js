import React, { useState, useCallback } from 'react';
import { setVars } from '../../utils/externalStore';
import { fetchData } from '../../utils/dataFetcher';

const Select = ({ eventType, placeholder, onChange, params }) => {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [valueKey, setValueKey] = useState('');
  const [labelKey, setLabelKey] = useState('');
  const [varName, setVarName] = useState('');

  const fetchOptions = useCallback(async () => {
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
    }
  }, [eventType, params]);

  const handleFocus = () => {
    if (options.length === 0) {
      fetchOptions();
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
    setVars({ [':' + varName]: value }); // Prefix the variable name with a ":"

    if (onChange) onChange(value);
  };

  return (
    <div className="select-container">
      <select
        id={varName}
        name={varName}
        onChange={handleChange}
        onFocus={handleFocus}
        className="p-2 border rounded w-full"
        value={selectedValue}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option[valueKey]} value={option[valueKey]}>
            {option[labelKey]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;


