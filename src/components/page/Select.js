import React, { useState, useEffect } from 'react';
import useExternalStore, { setVars, getVar } from '../utils/useExternalStore';

const fileName = 'Select: ';

const Select = ({ options = [], label, valueKey, labelKey, onChange, onFocus, varName, labelName }) => {
  const [selectedValue, setSelectedValue] = useState('');
  const variables = useExternalStore(); // Use externalStore to get the variables

  useEffect(() => {
    console.log(fileName, 'Options updated:', options);
    console.log(fileName, 'valueKey:', valueKey, 'labelKey:', labelKey, 'varName:', varName, 'labelName:', labelName);
    options.forEach((option, index) => {
      console.log(fileName, `Option ${index}:`, option);
    });
  }, [options, valueKey, labelKey, varName, labelName]);

  const handleChange = (e) => {
    const value = e.target.value;
    console.log(fileName, 'Selected value:', value);

    const selectedOption = (options || []).find(option => option[valueKey] === value);
    console.log(fileName, 'Selected option:', selectedOption);

    const labelValue = selectedOption ? selectedOption[labelKey] : '';
    console.log(fileName, 'Label value:', labelValue);

    setSelectedValue(value);
    if (onChange) onChange(value);

    console.log(fileName, 'Setting variables:', { [varName]: value, [labelName]: labelValue });
    setVars({ [varName]: value });
    setVars({ [labelName]: labelValue });
  };

  return (
    <select
      value={selectedValue}
      onChange={handleChange}
      onFocus={onFocus}
      className="p-2 border rounded"
    >
      <option value="" disabled>{label}</option>
      {Array.isArray(options) ? options.map((option) => (
        <option key={option[valueKey]} value={option[valueKey]}>
          {option[labelKey]}
        </option>
      )) : null}
    </select>
  );
};

export default Select;
