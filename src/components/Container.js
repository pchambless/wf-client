import React from 'react';
import PageHeader from './PageHeader'; // Adjusting the import path for PageHeader
import '../styles/tailwind.css';

const Container = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-lightGray"> {/* Apply the very light gray background */}
      <PageHeader />
      <main className="flex flex-row flex-grow p-4">
        {children}
      </main>
      {/* You can add a footer here if needed */}
    </div>
  );
};

export default Container;
