import React from 'react';
import '../styles/tailwind.css';
import PageHeader from './PageHeader';

const Container = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-lightGray">
      <PageHeader />
      <main className="flex flex-row flex-grow p-4">
        {children}
      </main>
      {/* You can add a footer here if needed */}
    </div>
  );
};

export default Container;
