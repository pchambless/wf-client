import { makeAutoObservable } from 'mobx';
import createLogger from '../utils/logger';

class FormStore {
  // Form state
  formData = {};
  errors = {};
  touched = {};
  isSubmitting = false;
  
  // Configuration
  pageMap = null;
  fields = [];
  
  constructor(pageMap, initialData = {}) {
    this.log = createLogger('FormStore');
    this.pageMap = pageMap;
    this.formData = { ...initialData };
    
    // Process the columnMap into form fields
    if (pageMap?.columnMap) {
      this.fields = this.processColumnMap(pageMap.columnMap);
    }
    
    // Make all properties observable
    makeAutoObservable(this);
  }
  
  // Import your existing validator functions
  validators = {
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
  
  // Process column map to get form fields (reusing your logic)
  processColumnMap(columnMap) {
    if (!Array.isArray(columnMap)) {
      this.log.error('Invalid columnMap structure (not an array)');
      return [];
    }
    
    // Filter visible fields and transform
    return columnMap
      .filter(col => !col.hideInForm && (col.group === undefined || col.group >= 0))
      .map(col => this.processColumnDefinition(col))
      .sort((a, b) => {
        // Sort by group, then by order
        if (a.group !== b.group) return (a.group || 0) - (b.group || 0);
        return (a.ordr || 0) - (b.ordr || 0);
      });
  }
  
  // Process single column definition (reused from your presenter)
  processColumnDefinition(column) {
    // Default field definition
    const field = {
      id: column.field,
      label: column.label || column.headerName || column.field,
      type: this.mapColumnTypeToFieldType(column),
      required: !!column.required,
      group: column.group || 0,
      ordr: column.ordr || 0,
      multiline: !!column.multiline,
      selList: column.selList,
      xs: column.xs || 12,
      sm: column.multiline ? 12 : 6
    };
    
    // Copy additional properties
    if (column.options || column.selList) {
      field.options = column.options || column.selList || [];
    }
    
    if (column.defaultValue !== undefined) field.defaultValue = column.defaultValue;
    if (column.helperText) field.helperText = column.helperText;
    if (column.min !== undefined) field.min = column.min;
    if (column.max !== undefined) field.max = column.max;
    
    return field;
  }
  
  // Map column type to field type (reused from your presenter)
  mapColumnTypeToFieldType(column) {
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
  
  // State update actions
  setFieldValue(fieldName, value) {
    this.formData[fieldName] = value;
    this.touched[fieldName] = true;
    this.validateField(fieldName);
  }
  
  setFormData(data) {
    this.formData = { ...data };
    this.errors = {};
    this.touched = {};
  }
  
  // Validation
  validateField(fieldName) {
    // Clear existing error
    delete this.errors[fieldName];
    
    // Find field definition
    const field = this.fields.find(f => f.id === fieldName);
    if (!field) return true;
    
    const value = this.formData[fieldName];
    
    // Required validation
    if (field.required && this.validators.required(value) !== true) {
      this.errors[fieldName] = 'This field is required';
      return false;
    }
    
    // Type-specific validation
    if (field.type === 'number') {
      if (this.validators.number(value) !== true) {
        this.errors[fieldName] = 'Must be a number';
        return false;
      }
      
      if (field.min !== undefined && this.validators.min(field.min)(value) !== true) {
        this.errors[fieldName] = `Minimum value is ${field.min}`;
        return false;
      }
      
      if (field.max !== undefined && this.validators.max(field.max)(value) !== true) {
        this.errors[fieldName] = `Maximum value is ${field.max}`;
        return false;
      }
    }
    
    return true;
  }
  
  validateAll() {
    let isValid = true;
    
    // Reset all errors
    this.errors = {};
    
    // Validate each field
    this.fields.forEach(field => {
      this.touched[field.id] = true;
      if (!this.validateField(field.id)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  // Form submission
  async submitForm(saveFunction) {
    if (!this.validateAll()) return false;
    
    try {
      this.isSubmitting = true;
      await saveFunction(this.formData);
      return true;
    } catch (error) {
      this.errors._form = error.message || 'Failed to save';
      return false;
    } finally {
      this.isSubmitting = false;
    }
  }
  
  // Computed properties
  get isValid() {
    return Object.keys(this.errors).length === 0;
  }
  
  get isDirty() {
    return Object.keys(this.touched).length > 0;
  }
  
  // Group fields by their group attribute
  getGroupedFields() {
    const groups = {};
    const groupKeys = [];
    
    this.fields.forEach(field => {
      const groupKey = field.group.toString();
      if (!groups[groupKey]) {
        groups[groupKey] = [];
        groupKeys.push(groupKey);
      }
      groups[groupKey].push(field);
    });
    
    return { groups, groupKeys: groupKeys.sort() };
  }
}

export default FormStore;
