import createLogger from '../../../utils/logger';
import { getVar } from '../../../utils/externalStore';

export class FormFieldPresenter {
  constructor() {
    this.log = createLogger('FormField.Presenter');
  }

  getFieldType(fieldConfig) {
    // Log the field configuration for debugging
    this.log.debug('Determining field type:', {
      field: fieldConfig.field,
      dataType: fieldConfig.dataType,
      hasSelList: Boolean(fieldConfig.selList),
      isMultiline: Boolean(fieldConfig.multiline)
    });

    if (fieldConfig.dataType === 'DATE') {
      return 'date';
    } else if (fieldConfig.selList) {
      return 'select';
    } else if (fieldConfig.multiline) {
      return 'multiline';
    } else {
      return 'text';
    }
  }

  getSelectOptions(fieldConfig) {
    const listName = fieldConfig.selList;
    if (!listName) {
      this.log.warn(`No selList specified for field: ${fieldConfig.field}`);
      return [];
    }

    const rawOptions = getVar(`:${listName}`) || [];
    
    this.log.debug('Getting select options:', { 
      field: fieldConfig.field,
      listName,
      rawCount: rawOptions.length,
      rawFirst: rawOptions[0]
    });

    // Transform options using first and second properties
    const options = rawOptions.map(opt => {
      const [idKey, labelKey] = Object.keys(opt);
      return {
        value: opt[idKey],
        label: opt[labelKey]
      };
    });

    this.log.debug('Transformed options:', {
      field: fieldConfig.field,
      count: options.length,
      first: options[0],
      values: options.map(o => o.value)
    });

    return options;
  }

  validateField(fieldConfig, value) {
    if (!fieldConfig.required) return true;
    return value !== null && value !== undefined && value !== ''; 
  }

  getFieldStyles(fieldConfig, theme) {
    const fieldType = this.getFieldType(fieldConfig);
    const isMultiline = fieldType === 'multiline';

    if (isMultiline) {
      return {
        width: '100%',
        '& .MuiInputBase-root': {
          backgroundColor: theme.palette.grey[50],
          minHeight: '120px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          padding: '8px'
        },
        '& .MuiInputBase-input': {
          position: 'relative !important',
          height: 'auto !important',
          overflow: 'auto',
          width: '100%',
          padding: '0 !important'
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: `1px solid ${theme.palette.grey[300]}`
        }
      };
    }

    // Regular field styles
    return {
      '& .MuiInputBase-root': {
        backgroundColor: theme.palette.grey[50],
        height: '40px'
      }
    };
  }

  getGridConfig(fieldConfig) {
    const isMultiline = this.getFieldType(fieldConfig) === 'multiline';
    
    return {
      xs: 12,
      sm: isMultiline ? 12 : 6,  // Full width for multiline
      sx: isMultiline ? { 
        paddingX: 2,  // Add horizontal padding
        marginY: 1    // Add vertical margin
      } : undefined
    };
  }
}
