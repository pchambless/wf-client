import { useEffect } from 'react';
import { configureStore, createSlice, createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import createLogger from './logger';

const log = createLogger('ExternalStore');

// 🔹 Redux Slice
const storeSlice = createSlice({
  name: 'variables',
  initialState: {},
  reducers: {
    setVariables: (state, action) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        state[key] = value;
      });
    },
    clearVariables: () => ({})
  },
});

// 🔹 Logger Middleware
const loggerMiddleware = (store) => (next) => (action) => {
  if (action.type === storeSlice.actions.setVariables.type) {
    const prevState = store.getState();
    const result = next(action);
    const updatedState = store.getState();

    Object.keys(action.payload || {}).forEach((key) => {
      const newValue = updatedState[key];
      const oldValue = prevState[key];

      if (oldValue !== newValue) {
        if (key.toLowerCase().includes('mode')) {
          log.info(`Mode changed: ${key}`, {
            newValue,
            previousValue: oldValue || 'undefined'
          });
        } else if (Array.isArray(newValue)) {
          const oldLength = oldValue ? oldValue.length : 0;
          const newLength = newValue.length;
          if (oldLength !== newLength) {
            log.info(`Array changed: ${key}`, { 
              previousLength: oldLength, 
              newLength 
            });
          }
        } else {
          log.info(`Variable set: ${key}`, { value: newValue });
        }
      }
    });
    
    return result;
  }
  
  return next(action);
};

// 🔹 Configure Store
const store = configureStore({
  reducer: storeSlice.reducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(loggerMiddleware),
});

// 🔹 Core API Functions
const setVars = (vars) => {
  store.dispatch(storeSlice.actions.setVariables(vars));
};

// Optional improvement to externalStore.js
// Add a more descriptive name and docstring:
const setVarsObject = (variablesObject) => {
  store.dispatch(storeSlice.actions.setVariables(variablesObject));
};

// Or create an alternate version that accepts key-value pairs:
const setVar = (key, value) => {
  store.dispatch(storeSlice.actions.setVariables({ [key]: value }));
};

const getVar = (variableName) => {
  const state = store.getState();
  return variableName in state ? state[variableName] : null;
};

const clearAllVars = () => {
  store.dispatch(storeSlice.actions.clearVariables());
  log.info('All variables cleared');
};

// 🔹 Memoized Selectors for Performance
const selectorCache = {};
const getSelector = (varName) => {
  if (!selectorCache[varName]) {
    selectorCache[varName] = createSelector(
      [(state) => state[varName]],
      (value) => value ?? null
    );
  }
  return selectorCache[varName];
};

// 🔹 React Hooks
const usePollVar = (varName, defaultValue = null) => {
  const selector = getSelector(varName);
  const value = useSelector(selector);
  return value !== null ? value : defaultValue;
};

// 🔹 Action System
const triggerAction = (actionName, payload = Date.now()) => {
  setVars({ [`%${actionName}`]: payload });
};

const useActionTrigger = (actionName, defaultValue = null) => {
  return usePollVar(`%${actionName}`, defaultValue);
};

const useActionEffect = (actionName, effect, dependencies = []) => {
  const actionValue = useActionTrigger(actionName);
  
  useEffect(() => {
    if (actionValue !== null) {
      effect(actionValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionValue, ...dependencies]);
};

// 🔹 Exports
export { 
  setVars,
  setVarsObject,
  setVar,
  getVar,
  clearAllVars,
  usePollVar,
  triggerAction,
  useActionTrigger,
  useActionEffect,
  Provider as StoreProvider
};

export default store;
