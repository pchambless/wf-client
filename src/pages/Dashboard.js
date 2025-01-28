import React, { useEffect } from 'react';
import DebugPanel from '../components/debug/DebugPanel';
import { useModalContext } from '../context/ModalContext';
import useLogger from '../hooks/useLogger';
import { usePageContext } from '../context/PageContext';

const Dashboard = () => {
  const pageTitle = 'Dashboard';
  const { openModal } = useModalContext();
  const logAndTime = useLogger('Dashboard');
  const { updatePageTitle } = usePageContext();

  useEffect(() => {
    logAndTime('Dashboard component mounted');
    updatePageTitle(pageTitle);
  }, [logAndTime, updatePageTitle, pageTitle]);

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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard title="Recent Orders" content="5 new orders" />
          <DashboardCard title="Inventory Status" content="3 items low in stock" />
          <DashboardCard title="Today's Revenue" content="$1,234.56" />
        </div>
      </div>
      <div className="w-full p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
        <h2 className="mb-2 text-lg font-bold">Debug Panel</h2>
        <DebugPanel />
      </div>
    </div>
  );
};

const DashboardCard = ({ title, content }) => (
  <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
    <h3 className="mb-2 text-lg font-semibold">{title}</h3>
    <p>{content}</p>
  </div>
);

export default Dashboard;
