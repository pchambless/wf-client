import React, { forwardRef, useImperativeHandle, useState, useCallback, useMemo, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import { FormFieldRenderer } from '../FormField';
import { FormPresenter } from './Presenter';
import { ACTION_TYPES, startUserAction } from '../../../utils/logger/actions';
import createLogger from '../../../utils/logger';

const Form = forwardRef(({ columnMap, onSubmit, formMode }, ref) => {
  const theme = useTheme();
  const log = createLogger('Form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [fields, setFields] = useState([]);

  const presenter = useMemo(() => new FormPresenter(columnMap), [columnMap]);

  const refresh = useCallback(async () => {
    log.debug('Refreshing form data');
    try {
      const newData = await presenter.getFormData();
      log.debug('Form refreshed with data:', newData);
      setFormData(newData);

      const visibleFields = await presenter.getFields();
      setFields(visibleFields);
    } catch (error) {
      log.error('Error refreshing form:', error);
    }
  }, [presenter, log]);

  const handleInputChange = useCallback((field, value) => {
    log.debug('Field changed:', { field, value });
    setFormData(prev => ({ ...prev, [field]: value }));
    presenter.updateField(field, value);
  }, [presenter, log]);

  const handleSubmit = useCallback(async () => {
    startUserAction(ACTION_TYPES.SUBMIT);
    log.info('Form submission started');
    setLoading(true);
    setError(null);
    try {
      const result = await presenter.handleSubmit(formData);
      if (result) {
        log.info('Form submitted successfully');
        onSubmit?.();
        return true;
      }
    } catch (err) {
      log.error('Form submission failed:', err);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [presenter, formData, onSubmit, log]);

  useImperativeHandle(ref, () => ({
    refresh: async () => await refresh(),
    handleSubmit
  }), [refresh, handleSubmit]);

  const isSubmitDisabled = formMode === 'view' || loading;

  useEffect(() => {
    const loadFields = async () => {
      setLoading(true);
      try {
        const visibleFields = await presenter.getFields();
        setFields(visibleFields);
      } catch (error) {
        console.error('Error loading form fields:', error);
      } finally {
        setLoading(false);
      }
    };
    loadFields();
  }, [presenter]);

  return (
    <Box 
      className="form-container"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        minHeight: '100%',
        '& .MuiFormControl-root': {
          backgroundColor: theme.palette.background.default
        }
      }}
    >
      <FormFieldRenderer 
        visibleFields={fields}
        formData={formData}
        handleInputChange={handleInputChange}
        loading={loading}
        error={error}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </Box>
    </Box>
  );
});

export default Form;
