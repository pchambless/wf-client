import { configureStore } from '@reduxjs/toolkit';
import { useSyncExternalStore } from 'react';
import createLogger from './logger';

// Create a logger instance for externalStore
const log = createLogger('ExternalStore');

// Initial state
const initialState = {};

// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_VARS':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

// Create store using configureStore
const store = configureStore({
  reducer: reducer
});

const setVars = (vars) => {
  // Log only in development mode and only when meaningful changes occur
  const prevState = store.getState();
  store.dispatch({ type: 'SET_VARS', payload: vars });
  const updatedState = store.getState();
  
  // Log only important state changes
  if (process.env.NODE_ENV === 'development') {
    Object.keys(vars).forEach(key => {
      const newValue = updatedState[key];
      const oldValue = prevState[key];
      
      if (oldValue !== newValue) {
        if (key.toLowerCase().includes('mode')) {
          // Always log mode changes as they're important for debugging
          log(`Mode changed: ${key}`, {
            newValue,
            previousValue: oldValue || 'undefined'
          });
        } else if (Array.isArray(newValue)) {
          // For arrays, just log length changes to reduce noise
          const oldLength = oldValue ? oldValue.length : 0;
          const newLength = newValue.length;
          if (oldLength !== newLength) {
            log(`Array changed: ${key}`, { 
              previousLength: oldLength, 
              newLength 
            });
          }
        } else if (key === 'formMode') {
          // Always show formMode changes prominently
          log(`Form mode changed`, {
            newValue,
            previousValue: oldValue || 'undefined'
          });
        } else {
          // For other values, show concise changes
          log(`Variable set: ${key}`, { value: newValue });
        }
      }
    });
  }
};

const getVars = (vars) => {
  const state = store.getState();
  
  if (!Array.isArray(vars)) {
    log.error('getVars expects an array of variable names');
    return {};
  }

  return vars.reduce((acc, key) => {
    if (state.hasOwnProperty(key)) {
      acc[key] = state[key];
    }
    return acc;
  }, {});
};

const getVar = (variableName) => {
  const state = store.getState();
  return state.hasOwnProperty(variableName) ? state[variableName] : null;
};

const setVar = (key, value) => {
  setVars({ [key]: value });
  return getVar(key);
};

const subscribe = (listener) => store.subscribe(listener);

const listVars = () => {
  const state = store.getState();
  
  // Format arrays and objects for cleaner output
  const formattedState = Object.entries(state).reduce((acc, [key, value]) => {
    if (Array.isArray(value)) {
      acc[key] = `[Array with ${value.length} items]`;
    } else if (typeof value === 'object' && value !== null) {
      acc[key] = '{Object}';
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
  
  log('Current state variables', formattedState);
  return state;
};

const useExternalStore = () => {
  return useSyncExternalStore(
    subscribe, 
    () => store.getState(), 
    () => store.getState()  // This function provides the server snapshot
  );
};

// Debug function to clear all variables
const clearAllVars = () => {
  store.dispatch({ type: 'SET_VARS', payload: {} });
  log('All variables cleared');
};

export { 
  setVars, 
  listVars, 
  getVar, 
  setVar,
  useExternalStore, 
  subscribe, 
  getVars,
  clearAllVars 
};

export default store;
