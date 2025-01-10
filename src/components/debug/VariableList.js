import React from 'react';
import { useVariableContext } from '../../context/VariableContext';

const VariableList = () => {
  const { logSetVariables } = useVariableContext();

  // Filter out variables with empty values
  const populatedVariables = Object.entries(logSetVariables);
  return (
    <div>
      <h3>Populated Variables:</h3>
      {populatedVariables.length > 0 ? (
        <ul>
          {populatedVariables.map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      ) : (
        <p>No populated variables.</p>
      )}
    </div>
  );
};

export default VariableList;
