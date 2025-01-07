import React from 'react';
import PageTemplate from '../components/PageTemplate';

const Dashboard = () => {
  const pageTitle = 'Dashboard';
  const tableKey = 'dashboardTable'; // Placeholder key for the empty table
  const formKey = 'dashboardForm'; // Placeholder key for the empty form
  const columnToFormFieldMapping = {
    exampleColumn: { field: 'exampleField', label: 'Example Field' }
  };
  const excludeFormFields = [];
  const columnStyles = {
    exampleColumn: { width: '200px', backgroundColor: '#f0f0f0' }
  };

  return (
    <PageTemplate
      pageTitle={pageTitle}
      tableKey={tableKey}
      formKey={formKey}
      columnToFormFieldMapping={columnToFormFieldMapping}
      excludeFormFields={excludeFormFields}
      columnStyles={columnStyles}
    >
      <div className="p-4">
        <h2 className="mb-4 text-xl font-bold">Dashboard</h2>
        <p>Welcome to the Dashboard! This is a placeholder for future account-related data and summaries.</p>
      </div>
    </PageTemplate>
  );
};

export default Dashboard;
