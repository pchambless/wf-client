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

const setVars = (vars) => {
  store.dispatch({ type: 'SET_VARS', payload: vars });
};

const getVars = () => store.getState();

const getVar = (variableName) => {
  const state = store.getState();
  return state[variableName] || null;
};

// Adding back the setPrfxVars function
const setPrfxVars = (prefix, vars) => {
  console.log(`setPrfxVars called with prefix: "${prefix}" and vars:`, vars);

  const prefixedVars = Object.entries(vars).reduce((acc, [key, value]) => {
    const prefixedKey = `${prefix}${key}`;
    acc[prefixedKey] = value;
    console.log(`setPrfxVars: ${prefixedKey} set to ${value}`);
    return acc;
  }, {});

  console.log('Final prefixedVars:', prefixedVars);
  setVars(prefixedVars);
};

const subscribe = (listener) => store.subscribe(listener);

const listVars = () => store.getState();

const useExternalStore = () => {
  return useSyncExternalStore(
    subscribe, 
    getVars, 
    () => getVars()  // This function provides the server snapshot, can be adjusted as needed
  );
};

export { setVars, setPrfxVars, listVars, getVar, useExternalStore, subscribe, getVars };
export default store;
