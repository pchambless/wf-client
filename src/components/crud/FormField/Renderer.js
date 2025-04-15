import React, { useMemo } from 'react';
import { Grid, CircularProgress, Typography, Divider } from '@mui/material';
import FormField from './FormField';
import createLogger from '../../../utils/logger';
import formFieldPresenter from './Presenter';

const log = createLogger('FormField.Renderer');

/**
 * Renders a collection of form fields respecting group layout
 */
const FormFieldRenderer = ({ 
  visibleFields = [], 
  formData = {}, 
  handleInputChange, 
  loading = false,
  error = null 
}) => {
  // Group fields by their group property
  const groupedFields = useMemo(() => {
    return formFieldPresenter.groupFields(visibleFields);
  }, [visibleFields]);

  // Debug the incoming field data
  React.useEffect(() => {
    log.debug('FormFieldRenderer received fields:', {
      fieldCount: visibleFields.length,
      groupCount: groupedFields.length,
      fieldTypes: visibleFields.map(f => ({ id: f.id, type: f.type })),
      hasFormData: !!formData,
      formDataKeys: Object.keys(formData)
    });
    
    // Check for potential issues with select fields
    const selectFields = visibleFields.filter(field => field.type === 'select');
    if (selectFields.length > 0) {
      selectFields.forEach(field => {
        if (!field.options || !Array.isArray(field.options) || field.options.length === 0) {
          log.warn(`Select field ${field.id} has no options array or empty options`, field);
        }
      });
    }
  }, [visibleFields, formData, groupedFields]);

  if (loading) {
    return (
      <Grid container justifyContent="center">
        <CircularProgress />
      </Grid>
    );
  }

  if (error) {
    return (
      <div className="error-message">{error}</div>
    );
  }

  if (!visibleFields || visibleFields.length === 0) {
    return <div className="no-fields-message">No fields available</div>;
  }

  return (
    // Reduce spacing from 2 to 1 to make the form more compact
    <Grid container spacing={1}>
      {groupedFields.map((fieldsInGroup, groupIndex) => {
        // Count how many fields are in this group (for width calculation)
        const fieldCount = fieldsInGroup.length;
        // Determine if any field in the group should always be full width
        const hasFullWidthField = fieldsInGroup.some(f => f.type === 'textarea' || f.multiline);
        
        return (
          <React.Fragment key={`group-${groupIndex}`}>
            {/* Optional group divider between groups - with reduced margins */}
            {groupIndex > 0 && (
              <Grid item xs={12}>
                {/* Reduce margin from my: 1 to my: 0.5 */}
                <Divider sx={{ my: 0.5 }} />
              </Grid>
            )}
            
            {/* Group label if available from first field - with reduced bottom padding */}
            {fieldsInGroup[0]?.groupLabel && (
              <Grid item xs={12}>
                <Typography 
                  variant="subtitle2" 
                  color="textSecondary"
                  // Add compact styling
                  sx={{ pb: 0.5, fontSize: '0.85rem' }}
                >
                  {fieldsInGroup[0].groupLabel}
                </Typography>
              </Grid>
            )}
            
            {/* Create a container row for this group with reduced spacing */}
            <Grid item xs={12} container spacing={1}>
              {fieldsInGroup.map(field => {
                // CRITICAL: Calculate optimal field width based on group size
                // This ensures fields in the same group appear on the same line
                let smSize = hasFullWidthField ? 12 : 
                           field.type === 'textarea' || field.multiline ? 12 : 
                           fieldCount === 1 ? 12 :
                           fieldCount === 2 ? 6 :
                           fieldCount === 3 ? 4 :
                           fieldCount >= 4 ? 3 : 6;
                
                // Override with field's own sm size if specified
                if (field.sm) smSize = field.sm;
                
                return (
                  <Grid 
                    item 
                    xs={12} 
                    sm={smSize}
                    key={field.id}
                    // Add reduced vertical padding
                    sx={{ py: 0.5 }}
                  >
                    <FormField
                      field={field}
                      value={formData[field.id] || ''}
                      onChange={(value) => handleInputChange(field.id, value)}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </React.Fragment>
        );
      })}
    </Grid>
  );
};

export default FormFieldRenderer;
