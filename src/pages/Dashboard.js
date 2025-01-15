import React, { useEffect } from 'react';
import DebugPanel from '../components/debug/DebugPanel';
import { useModalContext } from '../context/ModalContext';
import useLogger from '../hooks/useLogger';
import { usePageContext } from '../context/PageContext';

const Dashboard = () => {
  const pageTitle = 'Dashboard';
  const { openModal } = useModalContext();
  const logAndTime = useLogger('Dashboard');
  const { setPageTitle } = usePageContext();

  useEffect(() => {
    logAndTime('Dashboard component mounted');
    setPageTitle(pageTitle);
  }, [logAndTime, setPageTitle, pageTitle]);

  const handleOpenTestModal = () => {
    logAndTime('Opening test modal');
    openModal('deleteConfirm');
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
        {/* Add more dashboard content here as needed */}
      </div>
      <div className="w-full p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
        <h2 className="mb-2 text-lg font-bold">Debug Panel</h2>
        <DebugPanel />
      </div>
    </div>
  );
};

export default Dashboard;
