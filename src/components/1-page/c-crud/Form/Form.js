import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Button,
  Divider,
  CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import FormField from '../FormField/FormField';
import FormStore from '@stores/FormStore'; // Capital F
import createLogger from '@utils/logger';

const log = createLogger('Form');

// Simplify with MobX pattern
const Form = observer(React.forwardRef(({ 
  pageMap, 
  formData: initialData = {}, 
  onSubmit,
  formMode: propFormMode = 'edit'
}, ref) => {
  // Log instead of defining unused variable
  log.debug('Rendering Form with mode:', propFormMode);
  
  // Create the form store
  const [formStore] = React.useState(() => new FormStore(pageMap, initialData));
  
  // Update form data when props change
  useEffect(() => {
    formStore.pageMap = pageMap;
    
    // FIXED: Use processColumnMap directly instead of non-existent processFields
    if (formStore.pageMap?.columnMap) {
      formStore.fields = formStore.processColumnMap(formStore.pageMap.columnMap);
    }
  }, [formStore, pageMap]);
  
  useEffect(() => {
    formStore.setFormData(initialData);
  }, [formStore, initialData]);
  
  // Form submission handler
  const handleSubmit = useCallback(async () => {
    if (onSubmit) {
      await formStore.submitForm(onSubmit);
    }
  }, [formStore, onSubmit]);
  
  // Reset form
  const resetForm = useCallback(() => {
    formStore.reset();
  }, [formStore]);
  
  // Expose methods to parent via ref
  React.useImperativeHandle(ref, () => ({
    submit: handleSubmit,
    reset: resetForm,
    getFormData: () => formStore.formData,
    setFieldValue: (field, value) => formStore.setFieldValue(field, value),
    isValid: () => Object.keys(formStore.errors).length === 0,
    refresh: () => {
      log.debug('Form refresh called');
      // FIXED: Use processColumnMap directly here too
      if (formStore.pageMap?.columnMap) {
        formStore.fields = formStore.processColumnMap(formStore.pageMap.columnMap);
      }
      formStore.setFormData(initialData);
    },
    setFormData: (data) => {
      formStore.setFormData(data);
    },
  }));
  
  // Get grouped fields
  const { groups, groupKeys } = formStore.getGroupedFields();
  const isViewMode = propFormMode === 'view';
  
  // Field change handler
  const handleChange = useCallback((field, value) => {
    formStore.setFieldValue(field, value);
  }, [formStore]);
  
  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      {groupKeys.length === 0 ? (
        <Box p={2} sx={{ textAlign: 'center', color: 'text.secondary' }}>
          No fields to display
        </Box>
      ) : (
        groupKeys.map(groupKey => (
          <Box key={groupKey} sx={{ mb: 2 }}>
            {/* Show group divider if it's not the first group */}
            {groupKey !== '0' && groupKey !== groupKeys[0] && (
              <Divider sx={{ my: 2 }} />
            )}
            
            {/* Field grid */}
            <Grid container spacing={2}>
              {groups[groupKey].map(field => (
                <Grid 
                  item 
                  key={field.field} 
                  xs={12} 
                  md={field.type === 'textarea' ? 12 : 6}
                >
                  <FormField
                    field={field}
                    value={formStore.formData[field.field]}
                    onChange={(value) => handleChange(field.field, value)}
                    error={formStore.touched[field.field] ? formStore.errors[field.field] : null}
                    disabled={isViewMode}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))
      )}
      
      {/* Submit button for edit/add modes */}
      {!isViewMode && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            onClick={handleSubmit}
            disabled={formStore.isSubmitting}
            variant="contained"
            color="primary"
            startIcon={formStore.isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {formStore.isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      )}
      
      {/* Form-level error */}
      {formStore.errors._form && (
        <Box sx={{ mt: 2, color: 'error.main' }}>
          {formStore.errors._form}
        </Box>
      )}
    </Box>
  );
}));

export default Form;
