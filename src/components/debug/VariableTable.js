import React from 'react';
import { listVars } from '../../utils/useExternalStore';

const VariableTable = () => {
  const variables = listVars();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Current Variables</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b border-gray-200">Variable Name</th>
            <th className="px-4 py-2 border-b border-gray-200">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(variables).length > 0 ? (
            Object.entries(variables).map(([key, value]) => (
              <tr key={key}>
                <td className="px-4 py-2 border-b border-gray-200">{key}</td>
                <td className="px-4 py-2 border-b border-gray-200">{value}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-2 border-b border-gray-200" colSpan="2">
                No variables set.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VariableTable;
