import React from 'react';
import PageHeader from './PageHeader'; // Adjusting the import path for PageHeader

const Container = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader />
      <main className="flex flex-row flex-grow p-4">
        {children}
      </main>
      {/* You can add a footer here if needed */}
    </div>
  );
};

export default Container;
