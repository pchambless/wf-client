import React from 'react';
import PageHeader from '../components/PageHeader';

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <PageHeader />
      <div className="p-4">
        <h2 className="mb-4 text-xl font-bold">Dashboard</h2>
        <p>Welcome to the Dashboard! This is a placeholder for future account-related data and summaries.</p>
      </div>
    </div>
  );
};

export default Dashboard;
