import { createStore } from 'redux';
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

// Create store
const store = createStore(reducer);

const setVars = (vars) => {
  store.dispatch({ type: 'SET_VARS', payload: vars });
};

const getVars = () => store.getState();

const getVar = (variableName) => {
  const state = store.getState();
  return state[variableName] || null;
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

export { setVars, listVars, getVar, useExternalStore, subscribe, getVars };
export default store;
