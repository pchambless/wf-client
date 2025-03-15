import React, { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material'; // Removed Grid import
import createLogger from '../../utils/logger';
import { useForm } from '../../stores';
import FormFieldRenderer from './FormFieldRenderer';

const log = createLogger('CrudForm');

const CrudForm = ({ pageConfig, formData, setFormData, onSubmit }) => {
  // Use form store for all state management
  const form = useForm(`crud.${pageConfig?.[0]?.dbTable || 'default'}`, {
    initialData: formData || {}
  });

  // Debug the pageConfig
  useEffect(() => {
    if (pageConfig) {
      log('Page config:', { 
        fieldCount: pageConfig.length,
        visibleFields: pageConfig.filter(f => f.group > 0).length,
        fieldGroups: pageConfig.reduce((acc, f) => {
          if (f.group > 0) {
            acc[f.group] = (acc[f.group] || 0) + 1;
          }
          return acc;
        }, {})
      });
    }
  }, [pageConfig]);

  // Initial setup and sync with external props
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      log('Setting form data from props', { 
        fields: Object.keys(formData)
      });
      form.setData({...formData});
    }
  }, [formData, form]);
  
  // Log the current form data
  useEffect(() => {
    log('Form data updated:', { 
      fields: Object.keys(form.data),
      hasData: Object.keys(form.data).length > 0
    });
  }, [form.data]);
  
  const handleChange = (field, value) => {
    log('Field changed', { field, value, prevValue: form.data[field] });
    form.updateData({ [field]: value });
    
    // Propagate changes to parent if needed
    if (setFormData) {
      setFormData({...form.data, [field]: value});
    }
  };
  
  const handleSubmit = (values, _fieldConfig) => {
    // Handle form submission
    onSubmit(values);
  };

  // Ensure we have page config
  if (!pageConfig || !Array.isArray(pageConfig)) {
    log.warn('No pageConfig provided to CrudForm');
    return null;
  }
  
  // Filter fields to display in form (group > 0)
  const visibleFields = pageConfig.filter(field => field.group > 0) || [];
  
  // Sort fields by group and order
  const sortedFields = [...visibleFields].sort((a, b) => {
    if (a.group !== b.group) {
      return a.group - b.group;
    }
    return (a.order || 0) - (b.order || 0);
  });
  
  // Group fields into sections by group
  const fieldGroups = {};
  sortedFields.forEach(field => {
    const group = field.group.toString();
    if (!fieldGroups[group]) {
      fieldGroups[group] = [];
    }
    fieldGroups[group].push(field);
  });
  
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {Object.entries(fieldGroups).map(([group, fields]) => (
        <Box key={group} mb={3}>
          {/* Only show group label if it has one and group isn't 0 */}
          {fields[0]?.groupLabel && group !== '0' && (
            <Typography variant="h6" gutterBottom>
              {fields[0].groupLabel}
            </Typography>
          )}
          
          <FormFieldRenderer
            visibleFields={fields}
            formData={form.data}
            handleInputChange={handleChange}
            loading={false}
            error={null}
          />
        </Box>
      ))}
      
      <Box mt={3}>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default CrudForm;
