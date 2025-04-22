import React, { createContext, useContext, useReducer, useMemo } from 'react';
import createLogger from '../utils/logger';

const log = createLogger('AppState');

// Create context
const AppStateContext = createContext();

// Actions
const SET_VARIABLE = 'SET_VARIABLE';
const CLEAR_ALL = 'CLEAR_ALL';
const TRIGGER_ACTION = 'TRIGGER_ACTION';

// Reducer
function appStateReducer(state, action) {
  switch (action.type) {
    case SET_VARIABLE:
      log.debug(`Setting variable ${action.key}`, action.value);
      return {
        ...state,
        variables: {
          ...state.variables,
          [action.key]: action.value
        }
      };
    case CLEAR_ALL:
      return {
        ...state,
        variables: {}
      };
    case TRIGGER_ACTION:
      log.debug(`Triggering action ${action.name}`, action.payload);
      return {
        ...state,
        actions: {
          ...state.actions,
          [action.name]: {
            payload: action.payload,
            timestamp: Date.now()
          }
        }
      };
    default:
      return state;
  }
}

// Provider component
export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(appStateReducer, {
    variables: {},
    actions: {}
  });

  // Create memoized value
  const contextValue = useMemo(() => {
    return {
      // Variable functions
      getVar: (key) => state.variables[key],
      setVar: (key, value) => dispatch({ 
        type: SET_VARIABLE, key, value 
      }),
      clearAll: () => dispatch({ type: CLEAR_ALL }),
      
      // Action functions
      triggerAction: (name, payload) => dispatch({
        type: TRIGGER_ACTION, name, payload
      }),
      getActionPayload: (name) => state.actions[name]?.payload,
      
      // State
      state
    };
  }, [state]);

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
}

// Custom hooks
export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}

export function useVar(key, defaultValue = null) {
  const { getVar } = useAppState();
  const value = getVar(key) ?? defaultValue;
  return value;
}

export function useAction(actionName) {
  const { getActionPayload, triggerAction } = useAppState();
  return [getActionPayload(actionName), (payload) => triggerAction(actionName, payload)];
}
