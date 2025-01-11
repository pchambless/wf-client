import React from 'react';
import useExternalStore from '../../utils/useExternalStore';

const VariableList = () => {
  const variables = useExternalStore();
  const populatedVariables = Object.entries(variables);

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
