import React from 'react';
import { useSelectContext } from '../../context/SelectContext';
import { useModalContext } from '../../context/ModalContext';

const DebugStateTable = () => {
  const { modalState } = useModalContext();
  const { selectedItems } = useSelectContext();
  // Get other state values from different contexts as needed

  const stateMapping = {
    'Modal State': {
      isOpen: modalState.isOpen,
      modalTitle: modalState.config?.title,
      modalConfig: JSON.stringify(modalState.config),
    },
    'Select State': { selectedItems: JSON.stringify(selectedItems) },
    // Add other state mappings as needed
  };

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Debug State Table</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">State</th>
            <th className="px-4 py-2 border-b">Value</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(stateMapping).map(([stateName, stateObj]) => (
            <tr key={stateName}>
              <td className="px-4 py-2 font-semibold border-b">{stateName}</td>
              <td className="px-4 py-2 border-b">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(stateObj, null, 2)}
                </pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DebugStateTable;
