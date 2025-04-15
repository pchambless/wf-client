import React from 'react';
import { Grid, CircularProgress, Alert, Typography, Box, Divider } from '@mui/material';
import FormField from './index';
import createLogger from '../../../utils/logger';

const log = createLogger('FormFieldRenderer');

/**
 * Renders a collection of form fields with proper layout and organization
 */
export const FormFieldRenderer = ({ 
  visibleFields = [], 
  formData = {}, 
  handleInputChange,
  loading = false,
  error = null
}) => {
  // Group fields for better organization
  const fieldsByGroup = React.useMemo(() => {
    const groups = {};
    
    visibleFields.forEach(field => {
      // Default to group 1 if not specified
      const group = field.group || 1;
      
      if (!groups[group]) {
        groups[group] = [];
      }
      
      groups[group].push(field);
    });
    
    log.debug('Fields organized by groups:', {
      groupCount: Object.keys(groups).length,
      fieldCount: visibleFields.length
    });
    
    return groups;
  }, [visibleFields]);
  
  // Handle empty fields case
  if (visibleFields.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">
          {loading ? 'Loading form fields...' : 'No form fields available'}
        </Typography>
        {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}
      </Box>
    );
  }
  
  return (
    <Box sx={{ position: 'relative', pb: 1 }}>
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Loading overlay */}
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            borderRadius: 1,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      
      {/* Render fields by group */}
      {Object.entries(fieldsByGroup)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([group, fields], groupIndex) => (
          <React.Fragment key={`group-${group}`}>
            {/* Add dividers between groups */}
            {groupIndex > 0 && (
              <Divider sx={{ my: 2 }} />
            )}
            
            {/* Group title for groups > 1 */}
            {Number(group) > 1 && (
              <Typography 
                variant="subtitle2" 
                color="text.secondary" 
                sx={{ mt: 2, mb: 1 }}
              >
                {`Group ${group}`}
              </Typography>
            )}
            
            <Grid container spacing={2}>
              {fields.map((field) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={field.fullWidth ? 12 : 6} 
                  md={field.fullWidth ? 12 : 4}
                  key={field.id}
                >
                  <FormField
                    field={field}
                    value={formData[field.id]}
                    onChange={handleInputChange}
                    disabled={loading || field.readOnly}
                  />
                </Grid>
              ))}
            </Grid>
          </React.Fragment>
        ))}
    </Box>
  );
};

export default FormFieldRenderer;
