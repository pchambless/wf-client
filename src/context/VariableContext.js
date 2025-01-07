import React, { createContext, useContext, useState, useCallback } from 'react';
import useLogger from '../hooks/useLogger';

const VariableContext = createContext();
const fileName = 'VariableContext: ';

export const useVariableContext = () => useContext(VariableContext);

const VariableProvider = ({ children }) => {
  const logAndTime = useLogger(fileName);
  const [variables, setVariablesState] = useState({});

  // Update one or more variables
  const setVariables = useCallback((variablesToSet) => {
    setVariablesState((prev) => {
      const newVariables = { ...prev, ...variablesToSet };
      const updatedKeys = Object.keys(variablesToSet).join(', ');
      logAndTime(`Setting multiple variables: ${updatedKeys}`);

      // Log all variables with set values in array format
      const setVariablesLog = Object.entries(newVariables)
        .filter(([k, v]) => v !== '')
        .map(([k, v]) => `${k}: '${v}'`)
        .join(',\n');

      logAndTime('Logging all variables with set values:\n[\n' + setVariablesLog + '\n]');
      return newVariables;
    });
  }, [logAndTime]);

  const logSetVariables = useCallback(() => {
    const setVariablesLog = Object.entries(variables)
      .filter(([key, value]) => value !== '')
      .map(([key, value]) => `${key}: '${value}'`)
      .join(',\n');
    logAndTime('Current Variables with set values:\n[\n' + setVariablesLog + '\n]');
  }, [variables, logAndTime]);

  // Function to fetch a single variable value by variableName
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

export { VariableProvider };

export default VariableContext;
