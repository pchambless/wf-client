import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApiColumns } from '../api/api'; // Import the fetchApiColumns function

const VariableContext = createContext();

export const useVariableContext = () => useContext(VariableContext);

export const VariableProvider = ({ children }) => {
  const [variables, setVariables] = useState({});

  const setVariable = (name, value) => {
    setVariables((prevVariables) => ({
      ...prevVariables,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchVariables = async () => {
      try {
        const response = await fetchApiColumns();
        if (response.apiColumns) {
          const vars = response.apiColumns.reduce((acc, row) => {
            acc[row.variableName.slice(1)] = ''; // Initialize with an empty value
            return acc;
          }, {});
          setVariables(vars);
        }
      } catch (error) {
        console.error('Error fetching variables:', error);
      }
    };

    fetchVariables();
  }, []);

  return (
    <VariableContext.Provider value={{ variables, setVariable }}>
      {children}
    </VariableContext.Provider>
  );
};
