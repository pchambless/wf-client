import React, { useEffect, useState } from 'react';
import { useModalContext } from '../context/ModalContext';
import useLogger from '../hooks/useLogger';
import { useGlobalContext } from '../context/GlobalContext';

const Dashboard = () => {
  const pageTitle = 'Dashboard';
  const { openModal } = useModalContext();
  const logAndTime = useLogger('Dashboard');
  const { updatePageTitle, pageConfigs } = useGlobalContext();
  const [selectedConfig, setSelectedConfig] = useState(null);

  useEffect(() => {
    logAndTime('Dashboard component mounted');
    updatePageTitle(pageTitle);
  }, [logAndTime, updatePageTitle, pageTitle]);

  const handleOpenTestModal = () => {
    logAndTime('Opening test modal');
    openModal('deleteConfirm');
  };

  const handleRowClick = (config) => {
    setSelectedConfig(config);
  };

  return (
    <div className="flex flex-col h-full p-4">
      <h1 className="mb-4 text-2xl font-bold">{pageTitle}</h1>
      <div className="flex-grow mb-4">
        <button
          onClick={handleOpenTestModal}
          className="px-4 py-2 mb-4 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Open Test Modal
        </button>
      </div>
      <div className="flex">
        <div className="w-1/2">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Page Title</th>
                <th className="py-2">App Layout</th>
                <th className="py-2">List Event</th>
                <th className="py-2">DB Table</th>
              </tr>
            </thead>
            <tbody>
              {pageConfigs.map((config) => (
                <tr key={config.pageName} onClick={() => handleRowClick(config)} className="cursor-pointer">
                  <td className="py-2">{config.pageTitle}</td>
                  <td className="py-2">{config.appLayout}</td>
                  <td className="py-2">{config.listEvent}</td>
                  <td className="py-2">{config.dbTable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-1/2 p-4">
          {selectedConfig && (
            <div>
              <h2 className="text-xl font-bold">Column Map</h2>
              <textarea
                className="w-full h-64 p-2 border rounded"
                readOnly
                value={JSON.stringify(selectedConfig.columnMap, null, 2)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
