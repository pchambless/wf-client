import createLogger from '../../../../../utils/logger';

const log = createLogger('FormField.Presenter');

/**
 * Processes and validates field definitions
 */
export class FormFieldPresenter {
  constructor(selectOptionsMap = {}) {
    this.selectOptionsMap = selectOptionsMap;
    this.validators = {
      required: (value) => value !== undefined && value !== null && value !== '' 
        ? true 
        : 'This field is required',
      
      email: (value) => {
        if (!value) return true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? true : 'Invalid email format';
      },
      
      minLength: (len) => (value) => {
        if (!value) return true;
        return value.length >= len ? true : `Minimum length is ${len}`;
      },
      
      maxLength: (len) => (value) => {
        if (!value) return true;
        return value.length <= len ? true : `Maximum length is ${len}`;
      },
      
      number: (value) => {
        if (value === null || value === undefined || value === '') return true;
        return !isNaN(Number(value)) ? true : 'Must be a number';
      },
      
      min: (min) => (value) => {
        if (value === null || value === undefined || value === '') return true;
        return Number(value) >= min ? true : `Minimum value is ${min}`;
      },
      
      max: (max) => (value) => {
        if (value === null || value === undefined || value === '') return true;
        return Number(value) <= max ? true : `Maximum value is ${max}`;
      }
    };
  }
  
  /**
   * Process columnMap to extract and validate form fields
   */
  processColumnMap(pageMap) {
    if (!pageMap) {
      log.error('No pageMap provided');
      return [];
    }
    
    // Get columnMap from new structure
    const columnMap = Array.isArray(pageMap) ? pageMap : pageMap.columnMap;
    
    if (!Array.isArray(columnMap)) {
      log.error('Invalid columnMap structure (not an array)', columnMap);
      return [];
    }
    
    // Filter visible fields and transform
    const fields = columnMap
      .filter(col => !col.hideInForm && (col.group === undefined || col.group >= 0))
      .map(col => this.processColumnDefinition(col))
      .sort((a, b) => {
        // Sort by group, then by order
        if (a.group !== b.group) return (a.group || 0) - (b.group || 0);
        return (a.ordr || 0) - (b.ordr || 0);
      });
    
    log.debug(`Processed ${fields.length} fields from columnMap`);
    return fields;
  }
  
  /**
   * Process a single column definition into a form field
   */
  processColumnDefinition(column) {
    // Default field definition
    const field = {
      id: column.field,
      label: column.label || column.headerName || column.field,
      type: this.mapColumnTypeToFieldType(column),
      required: !!column.required,
      group: column.group || 0,
      ordr: column.ordr || 0, // Include ordering within group
      multiline: !!column.multiline,
      selList: column.selList, // Keep the selList name for reference
      xs: column.xs || 12,
      sm: column.multiline ? 12 : 6 // Full width for multiline fields
    };
    
    // Copy additional properties
    if (column.options || column.selList) {
      field.options = this.processOptions(column.options || this.selectOptionsMap[column.selList] || []);
      field.selList = column.selList; // Keep the selList name for future reference
    }
    
    if (column.defaultValue !== undefined) field.defaultValue = column.defaultValue;
    if (column.helperText) field.helperText = column.helperText;
    if (column.min !== undefined) field.min = column.min;
    if (column.max !== undefined) field.max = column.max;
    
    // Build validator
    field.validator = this.buildValidator(column);
    
    return field;
  }
  
  /**
   * Map column type to form field type considering multiple properties
   */
  mapColumnTypeToFieldType(column) {
    // Enhanced type mapping
    if (column.multiline) return 'textarea';
    if (column.selList) return 'select';
    if (column.dataType === 'DATE') return 'date';
    if (column.dataType === 'INT') return 'number';
    
    // Then fall back to general type mapping
    switch (column.type) {
      case 'number': return 'number';
      case 'boolean': return 'checkbox';
      case 'date': return 'date';
      case 'datetime': return 'datetime-local';
      case 'select': return 'select';
      case 'multiline': return 'textarea';
      case 'checkbox': return 'checkbox';
      case 'switch': return 'switch';
      case 'radio': return 'radio';
      default: return 'text';
    }
  }
  
  /**
   * Standardize options data structure
   */
  processOptions(options) {
    if (!options) return [];
    
    // If options is a function, it should be evaluated
    if (typeof options === 'function') {
      try {
        const result = options();
        log.debug('Evaluated options function:', { result });
        return this.processOptions(result);
      } catch (err) {
        log.error('Failed to evaluate options function:', err);
        return [];
      }
    }
    
    // If already array of objects with value/label, return as is
    if (Array.isArray(options) && options.length > 0) {
      // Check if objects have value/label structure
      if (typeof options[0] === 'object' && (options[0].value !== undefined || options[0].id !== undefined)) {
        return options;
      }
      
      // Convert primitive array to value/label objects
      return options.map(option => {
        if (typeof option === 'object') {
          return {
            value: option.id || option.value || option,
            label: option.name || option.label || option.toString()
          };
        }
        return {
          value: option,
          label: option.toString()
        };
      });
    }
    
    log.warn('Invalid options format:', options);
    return [];
  }
  
  /**
   * Build validator function based on column definition
   */
  buildValidator(column) {
    const validations = [];
    
    if (column.required) {
      validations.push(this.validators.required);
    }
    
    if (column.type === 'number') {
      validations.push(this.validators.number);
      if (column.min !== undefined) validations.push(this.validators.min(column.min));
      if (column.max !== undefined) validations.push(this.validators.max(column.max));
    }
    
    if (column.type === 'email') {
      validations.push(this.validators.email);
    }
    
    if (column.minLength) {
      validations.push(this.validators.minLength(column.minLength));
    }
    
    if (column.maxLength) {
      validations.push(this.validators.maxLength(column.maxLength));
    }
    
    if (column.validator && typeof column.validator === 'function') {
      validations.push(column.validator);
    }
    
    // Return composite validator
    return (value) => {
      for (const validator of validations) {
        const result = validator(value);
        if (result !== true) return result;
      }
      return true;
    };
  }

  /**
   * Group fields by their group attribute
   */
  groupFields(fields) {
    // Create a Map to hold fields grouped by their group value
    const groupedFields = new Map();
    
    fields.forEach(field => {
      // Skip fields with negative group values (they're hidden)
      if (field.group !== undefined && field.group < 0) {
        return;
      }
      
      const groupKey = field.group !== undefined ? field.group : 0;
      if (!groupedFields.has(groupKey)) {
        groupedFields.set(groupKey, []);
      }
      groupedFields.get(groupKey).push(field);
    });
    
    // Sort fields within each group by the ordr property
    for (const [groupKey, fieldsInGroup] of groupedFields) {
      groupedFields.set(
        groupKey, 
        fieldsInGroup.sort((a, b) => {
          // Primary sort by ordr if available
          if (a.ordr !== undefined && b.ordr !== undefined) {
            return a.ordr - b.ordr;
          }
          // Secondary sort by field id
          return a.id?.localeCompare(b.id || '');
        })
      );
    }
    
    // Return as array of groups, sorted by group key
    return Array.from(groupedFields.entries())
      .sort(([keyA], [keyB]) => keyA - keyB)
      .map(([_, fieldsInGroup]) => fieldsInGroup);
  }
}

// Create a named instance instead of an anonymous export
const formFieldPresenter = new FormFieldPresenter();
export default formFieldPresenter;
