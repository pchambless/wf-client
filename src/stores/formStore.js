import { getVar, setVars, subscribe } from '../utils/externalStore';
import createLogger from '../utils/logger';

const log = createLogger('FormStore');

/**
 * Creates a form state manager for a specific form
 * @param {string} formName - Unique identifier for the form
 * @param {object} options - Configuration options
 * @returns {object} Form state manager API
 */
export const createForm = (formName, options = {}) => {
  const {
    initialMode = 'add',
    initialData = {},
    prefix = ':form.',
    columnConfig = null  // Add this line
  } = options;
  
  // Keys for accessing form state in external store
  const modeKey = `${prefix}${formName}.mode`;
  const dataKey = `${prefix}${formName}.data`;
  
  // Initialize form state if not already set
  const initialize = () => {
    const currentMode = getVar(modeKey);
    const currentData = getVar(dataKey);
    
    if (!currentMode) {
      log(`Initializing form "${formName}" with mode "${initialMode}"`);
      setVars({ [modeKey]: initialMode });
    }
    
    if (!currentData && Object.keys(initialData).length > 0) {
      log(`Initializing form "${formName}" with default data`);
      setVars({ [dataKey]: initialData });
    }
    
    return {
      mode: currentMode || initialMode,
      data: currentData || initialData
    };
  };
  
  // Get current form state
  const getState = () => {
    return {
      mode: getVar(modeKey) || initialMode,
      data: getVar(dataKey) || initialData
    };
  };
  
  // Set form mode
  const setMode = (mode) => {
    log(`Setting ${formName} mode to "${mode}"`);
    setVars({ [modeKey]: mode });
    return mode;
  };
  
  // Set complete form data
  const setData = (data) => {
    log(`Setting ${formName} data`, { fields: Object.keys(data) });
    setVars({ [dataKey]: data });
    return data;
  };
  
  // Update partial form data
  const updateData = (updates) => {
    const currentData = getVar(dataKey) || initialData;
    const updatedData = { ...currentData, ...updates };
    
    log(`Updating ${formName} data fields:`, Object.keys(updates));
    setVars({ [dataKey]: updatedData });
    
    return updatedData;
  };
  
  // Reset form to initial state
  const reset = () => {
    log(`Resetting ${formName} form state`);
    setVars({ 
      [modeKey]: initialMode,
      [dataKey]: initialData
    });
    
    return { mode: initialMode, data: initialData };
  };
  
  // Subscribe to form state changes
  const watch = (callback) => {
    if (typeof callback !== 'function') {
      log.error('watch expects a function callback');
      return () => {};
    }
    
    // Initial call with current state
    callback(getState());
    
    // Subscribe to future changes
    return subscribe(() => {
      const state = getState();
      callback(state);
    });
  };
  
  const findFieldsByConfig = (options, columnConfig) => {
    if (!Array.isArray(options) || options.length === 0) {
      log.warn('No options provided for field detection');
      return { idField: 'id', nameField: 'name' };
    }

    if (!Array.isArray(columnConfig)) {
      log.warn('No column configuration provided');
      return guessIdAndNameFields(options); // fallback to existing method
    }

    // Find ID field from where=1 or group=-1
    const idColumn = columnConfig.find(col => 
      col.where === 1 || col.group === -1
    );
    
    // Find display field (usually the first visible field with width > 0)
    const displayColumn = columnConfig.find(col => 
      col.width > 0 && !col.selList && col.group >= 1
    );

    if (!idColumn) {
      log.warn('No ID column found in configuration, falling back to pattern matching');
      return guessIdAndNameFields(options);
    }

    return {
      idField: idColumn.field,
      nameField: displayColumn?.field || 'name'
    };
  };

  // Get field options for select lists
  const getFieldOptions = (field, columnConfig) => {
    if (!field.listName && !field.selList) {
      log.debug('No list specified for field:', field);
      return [];
    }
    
    try {
      const { getRefDataByName } = require('./accountStore');
      const options = getRefDataByName(field.listName || field.selList) || [];
      
      // Use column config if available, otherwise fall back to guessing
      const { idField, nameField } = columnConfig ? 
        findFieldsByConfig(options, columnConfig) : 
        guessIdAndNameFields(options);

      log.debug('Field options resolved:', {
        field: field.field,
        listName: field.listName || field.selList,
        idField,
        nameField,
        count: options.length
      });

      return {
        options,
        idField,
        nameField
      };
    } catch (error) {
      log.error(`Error getting options for field ${field.field}:`, error);
      return { options: [], idField: 'id', nameField: 'name' };
    }
  };
  
  // Utility function to guess ID and name fields based on common patterns
  const guessIdAndNameFields = (options) => {
    if (!Array.isArray(options) || options.length === 0) return { idField: 'id', nameField: 'name' };
    
    const firstItem = options[0];
    const keys = Object.keys(firstItem);
    
    // Find ID field - look for patterns like id, ID, [name]ID, [name]Id
    const idField = keys.find(k => 
      k === 'id' || 
      k === 'ID' || 
      k.endsWith('ID') || 
      k.endsWith('Id')
    ) || 'id';
    
    // Find name field - look for patterns like name, NAME, [name]Name, [name]NAME
    const nameField = keys.find(k => 
      k === 'name' || 
      k === 'NAME' || 
      k.endsWith('Name') || 
      k.endsWith('NAME')
    ) || 'name';
    
    return { idField, nameField };
  };
  
  // Initialize on creation
  initialize();
  
  // Return the form store API
  return {
    getState,
    setMode,
    setData,
    updateData,
    reset,
    watch,
    getFieldOptions: (field) => getFieldOptions(field, columnConfig),
    findFieldsByConfig: (options) => findFieldsByConfig(options, columnConfig)
  };
};

/**
 * React hook for using form store in components
 * @param {string} formName - Form identifier
 * @param {object} options - Form configuration options
 * @returns {object} Form state and methods
 */
export const useForm = (formName, options = {}) => {
  // Only import React if this function is used
  const { useState, useEffect, useRef } = require('react');
  
  // Create form manager once and store in ref
  const formRef = useRef(null);
  if (formRef.current === null) {
    formRef.current = createForm(formName, options);
  }
  
  // Set up local state that mirrors the external store
  const [state, setState] = useState(formRef.current.getState());
  
  // Subscribe to changes
  useEffect(() => {
    const form = formRef.current;
    const unsubscribe = form.watch(newState => {
      setState(newState);
    });
    
    return unsubscribe;
    // formName is included as a dependency but form is stable through useRef
     
  }, [formName]);
  
  const form = formRef.current;
  
  /**
   * Render a form field with a reference list
   * @param {object} field - Field configuration
   * @param {function} handleChange - Function to handle value changes
   * @returns {React.Element} Rendered form field
   */
  const renderSelectField = (field, handleChange) => {
    // Import React components for form fields
    const { FormControl, InputLabel, Select, MenuItem } = require('@mui/material');
    
    // Get options for this field
    const { options, idField, nameField } = form.getFieldOptions(field);
    
    return (
      <FormControl fullWidth margin="dense" key={field.field}>
        <InputLabel>{field.label}</InputLabel>
        <Select
          value={state.data[field.field] || ''}
          onChange={(e) => handleChange(field.field, e.target.value)}
          label={field.label}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {options.map((option) => (
            <MenuItem 
              key={option[idField]} 
              value={option[idField]}
            >
              {option[nameField]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };
  
  /**
   * Handle form field change
   * @param {string} field - Field name
   * @param {any} value - New field value
   */
  const handleChange = (field, value) => {
    form.updateData({
      [field]: value
    });
  };
  
  return {
    mode: state.mode,
    data: state.data,
    setMode: form.setMode,
    setData: form.setData,
    updateData: form.updateData,
    reset: form.reset,
    renderSelectField,
    handleChange
  };
};

/**
 * Helper for managing multiple related forms
 * @param {string} prefix - Common prefix for form names
 * @param {string[]} formNames - List of form identifiers
 * @param {object} defaultOptions - Default options for all forms
 * @returns {object} Map of form managers by name
 */
export const createFormGroup = (prefix, formNames, defaultOptions = {}) => {
  const forms = {};
  
  formNames.forEach(name => {
    const fullName = `${prefix}.${name}`;
    forms[name] = createForm(fullName, defaultOptions);
  });
  
  return forms;
};

/**
 * Set reference data for forms
 * @param {string} listName - Name of the reference list
 * @param {Array} data - Reference data
 */
export const setReferenceData = (listName, data) => {
  const { setRefDataByName } = require('./accountStore');
  setRefDataByName(listName, data);
};

/**
 * Get reference data for forms
 * @param {string} listName - Name of the reference list
 * @returns {Array} Reference data
 */
export const getReferenceData = (listName) => {
  const { getRefDataByName } = require('./accountStore');
  return getRefDataByName(listName);
};

let storeInitialized = false;

/**
 * Initialize form store
 * @returns {void}
 */
export const initFormStore = () => {
  if (storeInitialized) {
    log.debug('Form store already initialized');
    return;
  }

  log.debug('Initializing form store');
  
  // Just track initialization state
  storeInitialized = true;
};
