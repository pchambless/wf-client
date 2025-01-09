import React from 'react';
import PageTemplate from '../components/PageTemplate';
import VariableTable from '../components/debug/VariableTable';

const Dashboard = () => {
  const pageTitle = 'Dashboard';
  const listEvent = ''; // Placeholder event for the table data
  const editEvent = ''; // Placeholder event for the form data
  const addEvent = ''; // Placeholder event for adding form data

  const columnToFormFieldMapping = {
    // Add your column to form field mappings here if needed
  };

  const excludeFormFields = [];

  const columnStyles = {
    // Add your column styles here if needed
  };

  return (
    <PageTemplate
      pageTitle={pageTitle}
      listEvent={listEvent}
      editEvent={editEvent}
      addEvent={addEvent}
      columnToFormFieldMapping={columnToFormFieldMapping}
      excludeFormFields={excludeFormFields}
      columnStyles={columnStyles}
    >
      <div className="p-4">
        <h2 className="mb-4 text-xl font-bold">Dashboard</h2>
        <p>Welcome to the Dashboard! This is a placeholder for future account-related data and summaries.</p>

        {/* Add the VariableTable component here */}
        <VariableTable />
      </div>
    </PageTemplate>
  );
};

export default Dashboard;
