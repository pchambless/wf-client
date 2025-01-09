import React from 'react';
import { useVariableContext } from '../../context/VariableContext';

const VariableList = () => {
  const { variables } = useVariableContext();

  return (
    <div>
      <h3>Current Variables:</h3>
      {Object.keys(variables).length > 0 ? (
        <ul>
          {Object.entries(variables).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      ) : (
        <p>No variables set.</p>
      )}
    </div>
  );
};

export default VariableList;
