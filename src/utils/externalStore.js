import { configureStore } from '@reduxjs/toolkit';
import { useSyncExternalStore } from 'react';

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

const logCaller = () => {
  const error = new Error();
  const stack = error.stack.split('\n');
  const caller = stack[3].trim();
  console.log(`Called from: ${caller}`);
};

const setVars = (vars) => {
  logCaller();
  console.log('setVars called with:', vars);
  const prevState = store.getState();
  
  store.dispatch({ type: 'SET_VARS', payload: vars });
  
  const updatedState = store.getState();
//  console.log('New state after setVars:', updatedState);
  
  // Log the differences
  Object.keys(vars).forEach(key => {
    const newValue = updatedState[key];
    if (prevState[key] !== newValue) {
      console.log(`Variable ${key} changed from ${prevState[key]} to ${newValue}`);
 //   } else {
 //     console.log(`Variable ${key} did not change. Still ${newValue}`);
    }
  });
};

const getVars = (vars) => {
  logCaller();
  const state = store.getState();
  
  if (!Array.isArray(vars)) {
    console.error('getVars expects an array of variable names');
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
  logCaller();
  const state = store.getState();
//  console.log(`getVar called for ${variableName}`);
  const value = state.hasOwnProperty(variableName) ? state[variableName] : null;
  console.log(`getVar result for ${variableName}:`, value);
  return value;
};

const setVar = (key, value) => {
  logCaller();
  setVars({ [key]: value });
  return getVar(key);
};

const subscribe = (listener) => store.subscribe(listener);

const listVars = () => {
  logCaller();
  const state = store.getState();
  console.log('Current state:', state);
  return state;
};

const useExternalStore = () => {
  logCaller();
  return useSyncExternalStore(
    subscribe, 
    () => store.getState(), 
    () => store.getState()  // This function provides the server snapshot, can be adjusted as needed
  );
};

// Debug function to clear all variables
const clearAllVars = () => {
  logCaller();
  store.dispatch({ type: 'SET_VARS', payload: {} });
  console.log('All variables cleared. New state:', store.getState());
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
