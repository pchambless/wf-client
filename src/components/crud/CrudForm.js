import React from 'react';
import { TextField, Box } from '@mui/material';
import Select from '../page/Select'; // Import the Select component
import { getVar } from '../../utils/externalStore'; // Import getVar

const CrudForm = ({ pageConfig, formData, setFormData }) => {
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
          const fieldValue = getVar(`${field.setVar}`) || formData[field.field] || ''; // Get value from external store or formData
          const isRequired = field.required === 1 || field.required === undefined;

          if (field.selList) {
            return (
              <Box key={index} flex={1} mr={2}>
                <Select
                  eventType={field.selList}
                  placeholder={field.label}
                  onChange={(value) => handleInputChange(field.field, value)}
                  value={fieldValue} // Set the value from external store
                />
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
                multiline={field.label === 'Description'} // Make the Description field multiline
                rows={field.label === 'Description' ? 3 : 1} // Set the number of rows for the Description field
                sx={{ backgroundColor: '#f5f5f5' }} // Set background color to very light gray
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

export default CrudForm;
