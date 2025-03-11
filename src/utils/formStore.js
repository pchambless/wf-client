import { getVar, setVars, subscribe } from './externalStore';
import createLogger from './logger';

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
    prefix = ':form.'
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
  
  // Initialize on creation
  initialize();
  
  // Return the form store API
  return {
    getState,
    setMode,
    setData,
    updateData,
    reset,
    watch
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formName]);
  
  const form = formRef.current;
  
  return {
    mode: state.mode,
    data: state.data,
    setMode: form.setMode,
    setData: form.setData,
    updateData: form.updateData,
    reset: form.reset
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
