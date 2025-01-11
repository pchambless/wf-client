import React from 'react';
import PageTemplate from '../components/PageTemplate';
import DebugPanel from '../components/debug/DebugPanel';
import Modal from '../components/Modal';
import useModalManager from '../utils/modalManager';

const Dashboard = () => {
  const pageTitle = 'Dashboard';
  const listEvent = ''; // Testing with userAccts event
  const editEvent = ''; // Placeholder event for the form data
  const addEvent = ''; // Placeholder event for adding form data

  const { modalState, openModal, closeModal } = useModalManager();

  const columnToFormFieldMapping = {
    // Add your column to form field mappings here if needed
  };

  const excludeFormFields = [];

  const columnStyles = {
    // Add your column styles here if needed
  };

  return (
    <>
      <PageTemplate
        pageTitle={pageTitle}
        listEvent={listEvent}
        editEvent={editEvent}
        addEvent={addEvent}
        columnToFormFieldMapping={columnToFormFieldMapping}
        excludeFormFields={excludeFormFields}
        columnStyles={columnStyles}
      >
        <div className="flex flex-col h-full">
          {/* Your main dashboard content goes here */}
          <div className="flex-grow">
            {/* Add your dashboard widgets or content here */}
            <button
              onClick={() => openModal('userAccts')}
              className="px-4 py-2 mb-4 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Open Test Modal
            </button>
          </div>

          {/* Debug Panel */}
          <div className="w-full p-4 mt-4 bg-white border border-gray-300 rounded-lg shadow-lg">
            <h2 className="mb-2 text-lg font-bold">Debug Panel</h2>
            <DebugPanel />
          </div>
        </div>
      </PageTemplate>

      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.config?.title}
        content={modalState.config?.message || modalState.config?.listEvent}
        contentType={modalState.config?.type}
        listEvent='userAccts' // Placeholder event for the form data
      />
    </>
  );
};

export default Dashboard;
