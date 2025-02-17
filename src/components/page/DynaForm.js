import React from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';

const DynaForm = ({ pageConfig, formData, setFormData, selectOptions }) => {
  const handleInputChange = (key, value) => {
    setFormData(prevData => ({
      ...prevData,
      [key]: value
    }));
  };

  const renderFields = () => {
    if (!Array.isArray(pageConfig)) {
      return <div>Error: Invalid pageConfig format</div>;
    }

    const groupedFields = pageConfig.reduce((acc, field) => {
      if (field.group === 0) return acc; // Skip fields with group 0
      const group = field.group || 0; // Default to group 0 if not specified
      if (!acc[group]) acc[group] = [];
      acc[group].push(field);
      return acc;
    }, {});

    return Object.values(groupedFields).map((group, groupIndex) => (
      <Box display="flex" key={groupIndex} mb={2}>
        {group.map((field, index) => {
          const fieldValue = formData[field.field] || "";
          const isRequired = field.required === 1 || field.required === undefined;

          if (field.selList) {
            return (
              <Box key={index} flex={1} mr={2}>
                <FormControl fullWidth margin="normal" required={isRequired}>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    value={fieldValue}
                    onChange={(e) => handleInputChange(field.field, e.target.value)}
                  >
                    {selectOptions[field.field]?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            );
          }

          return (
            <Box key={index} flex={1} mr={2}>
              <TextField
                label={field.label}
                value={fieldValue}
                onChange={(e) => handleInputChange(field.field, e.target.value)}
                required={isRequired}
                fullWidth
                margin="normal"
              />
            </Box>
          );
        })}
      </Box>
    ));
  };

  return (
    <Box>
      {renderFields()}
    </Box>
  );
};

export default DynaForm;
