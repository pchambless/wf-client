import createLogger from '../../../utils/logger';
// Remove this import
// import { getVar } from '../../../utils/externalStore';

export class FormFieldPresenter {
  constructor(selectOptionsMap = {}) {
    this.log = createLogger('FormField.Presenter');
    this.selectOptionsMap = selectOptionsMap; // Store options directly
  }

  // Set options map for selections
  setSelectOptions(optionsMap) {
    this.selectOptionsMap = optionsMap;
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

  transformOptions(rawOptions) {
    if (!Array.isArray(rawOptions) || rawOptions.length === 0) {
      return [];
    }
    
    // Transform options using first and second properties
    const options = rawOptions.map(opt => {
      const [idKey, labelKey] = Object.keys(opt);
      return {
        value: opt[idKey],
        label: opt[labelKey]
      };
    });

    return options;
  }

  // Updated to use options passed directly instead of getVar
  getSelectOptions(fieldConfig) {
    const listName = fieldConfig.selList;
    if (!listName) {
      this.log.warn(`No selList specified for field: ${fieldConfig.field}`);
      return [];
    }

    // Use options from map instead of getVar
    const rawOptions = this.selectOptionsMap[listName] || [];
    return this.transformOptions(rawOptions);
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
