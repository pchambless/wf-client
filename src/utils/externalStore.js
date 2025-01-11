import { createStore } from 'redux';

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

export const setVars = (vars) => {
  store.dispatch({ type: 'SET_VARS', payload: vars });
};

export const getVars = () => store.getState();

export const getVar = (variableName) => {
  const state = store.getState();
  return state[variableName] || null;
};

export const subscribe = (listener) => store.subscribe(listener);

export const listVars = () => store.getState();

export default store;
