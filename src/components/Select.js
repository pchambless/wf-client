import React, { useState, useEffect } from 'react';
const fileName = 'Select: ';
const Select = ({ options = [], label, valueKey, labelKey, onChange, onFocus, name }) => {
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
    if (onChange) onChange(value);
  };

  useEffect(() => {
    console.log(fileName, 'Options updated:', options);
  }, [options]);

  return (
    <select
      value={selectedValue}
      onChange={handleChange}
      onFocus={onFocus}
      name={name}
      className="p-2 border rounded"
    >
      <option value="" disabled>{label}</option>
      {options.map((option) => (
        <option key={option[valueKey]} value={option[valueKey]}>
          {option[labelKey]}
        </option>
      ))}
    </select>
  );
};

export default Select;
