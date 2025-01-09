import React, { createContext, useContext, useState, useCallback } from 'react';
import useLogger from '../hooks/useLogger';

const VariableContext = createContext();
const fileName = 'VariableContext: ';

export const useVariableContext = () => useContext(VariableContext);

/**
 * Creates a VariableProvider component that manages a context for storing and retrieving variables.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the provider.
 * @returns {React.Component} A React component that provides the VariableContext to its children.
 */
export const VariableProvider = ({ children }) => {
  const logAndTime = useLogger(fileName);
  const [variables, setVariablesState] = useState({});

  /**
   * Validates if a given key is valid for use as a variable name.
   * 
   * @param {string} key - The key to validate.
   * @returns {boolean} True if the key is valid, false otherwise.
   */
  const isValidKey = (key) => {
    const validKeyPattern = /^[:a-zA-Z][a-zA-Z0-9_]*$/;
    return validKeyPattern.test(key);
  };

  /**
   * Updates one or more variables in the context state with validation and debugging.
   * 
   * @param {Object} variablesToSet - An object containing key-value pairs of variables to set.
   */
  const setVariables = useCallback((variablesToSet) => {
    console.trace('setVariables called with:', variablesToSet);

    if (typeof variablesToSet !== 'object') {
      console.error('setVariables expected an object but received:', variablesToSet);
      return;
    }

    setVariablesState((prev) => {
      const filteredVariablesToSet = Object.entries(variablesToSet)
        .filter(([key]) => isValidKey(key))
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});

      const newVariables = { ...prev, ...filteredVariablesToSet };
      const updatedKeys = Object.keys(filteredVariablesToSet).join(', ');
      logAndTime(`Setting multiple variables: ${updatedKeys}`);

      console.log('Filtered Variables to set:', filteredVariablesToSet);

      const setVariablesLog = Object.entries(newVariables)
        .filter(([k, v]) => v !== '')
        .map(([k, v]) => `${k}: '${v}'`)
        .join(',\n');

      logAndTime('Logging all variables with set values:\n[\n' + setVariablesLog + '\n]');
      return newVariables;
    });
  }, [logAndTime]);

  /**
   * Logs all currently set variables with non-empty values.
   */
  const logSetVariables = useCallback(() => {
    const setVariablesLog = Object.entries(variables)
      .filter(([key, value]) => value !== '')
      .map(([key, value]) => `${key}: '${value}'`)
      .join(',\n');
    logAndTime('Current Variables with set values:\n[\n' + setVariablesLog + '\n]');
  }, [variables, logAndTime]);

  /**
   * Fetches the value of a single variable by its name.
   * 
   * @param {string} variableName - The name of the variable to fetch.
   * @returns {*} The value of the variable if it exists, null otherwise.
   */
  const fetchVariable = useCallback((variableName) => {
    logAndTime(`Fetching variable: ${variableName}`);
    return variables[variableName] || null;
  }, [variables, logAndTime]);

  return (
    <VariableContext.Provider value={{ variables, setVariables, logSetVariables, fetchVariable }}>
      {children}
    </VariableContext.Provider>
  );
};

export default VariableContext;
