import React from 'react';
import ProductForm from '../components/ProductForm'; // Import ProductForm

const Admin = () => {
  const handleRestartServer = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/restart-server', { 
        method: 'POST',
      });
      if (response.ok) {
        alert('Server restarted successfully!');
      } else {
        const errorText = await response.text();
        alert(`Failed to restart the server: ${errorText}`);
      }
    } catch (error) {
      console.error('Error restarting server:', error);
      alert('Error restarting the server.');
    }
  };

  return (
    <ProductForm>
      <div className="flex flex-col items-center justify-center min-h-screen bg-product-bg">
        <h1 className="mb-6 text-3xl font-bold">Admin Page</h1>
        <button
          onClick={handleRestartServer}
          className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Restart Server
        </button>
      </div>
    </ProductForm>
  );
};

export default Admin;
