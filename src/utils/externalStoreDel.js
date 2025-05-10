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
    clearVariables: () => ({}),
    clearSpecificVariables: (state, action) => {
      action.payload.forEach((key) => {
        delete state[key];
      });
    },
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
// Keep only this version:
const setVars = (vars) => {
  // Add safety check to prevent character-by-character setting
  if (typeof vars !== 'object' || vars === null) {
    log.error('setVars requires an object parameter', { 
      receivedType: typeof vars 
    });
    return;
  }
  
  store.dispatch(storeSlice.actions.setVariables(vars));
};

const getVar = (variableName) => {
  const state = store.getState();
  return variableName in state ? state[variableName] : null;
};

const clearAllVars = () => {
  store.dispatch(storeSlice.actions.clearVariables());
  log.info('All variables cleared');
};

// Add this function to clear account-specific data without removing the account list
const clearAccountData = () => {
  const state = store.getState();
  const preserveKeys = [':userAcctList', ':token'];
  
  // Create a list of keys to clear (excluding preserved ones)
  const keysToClear = Object.keys(state).filter(key => 
    !preserveKeys.includes(key) && key !== 'form' && !key.startsWith('ui.')
  );
  
  // Clear these keys
  store.dispatch(storeSlice.actions.clearSpecificVariables(keysToClear));
  log.info('Account-specific data cleared');
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
  getVar,
  clearAllVars,
  clearAccountData,
  usePollVar,
  triggerAction,
  useActionTrigger,
  useActionEffect,
  Provider as StoreProvider
};

export default store;
