import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageContext } from '../context/PageContext';
import { useUserContext } from '../context/UserContext';
import { useSelectContext } from '../context/SelectContext';
import { useVariableContext } from '../context/VariableContext';
import logo from '../assets/wf-icon.png';
import ModalComponent from '../components/Modal';
import Table from '../components/Table'; // CHANGE: Import Table instead of SelTable
import AppNav from '../components/AppNav';

const PageHeader = () => {
  const { setUserEmail } = useUserContext();
  const { selectOptions, fetchSelectOptions } = useSelectContext();
  const { pageTitle } = usePageContext();
  const { setVariables } = useVariableContext();
  const [acctName, setAcctName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserEmail('');
    localStorage.clear();
    navigate('/');
  };

  const fetchAccounts = useCallback(() => {
    fetchSelectOptions('selUserAccts');
  }, [fetchSelectOptions]);


  useEffect(() => {
    if (!selectOptions['selUserAccts']) {
      fetchAccounts();
    }
  }, [fetchAccounts, selectOptions]);

  return (
    <div>
      <header className="flex items-center justify-between p-4 bg-gray-100 border-b border-[#008060] rounded-lg shadow-md">
        <div className="flex items-center">
          <img src={logo} alt="Whatsfresh Logo" className="w-12 h-12 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
        </div>
        <div className="flex items-center justify-center flex-1">
          <h2 className="text-3xl font-semibold text-ingredient-brdr">{acctName}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Select Accounts
          </button>
          <button onClick={handleLogout} className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">
            Logout
          </button>
        </div>
      </header>
      <AppNav />
      {/* CHANGE: Updated ModalComponent to use Table instead of SelTable */}
      <ModalComponent 
        isOpen={isModalOpen} 
        onRequestClose={() => setIsModalOpen(false)}
        title="Select Account"
      >
        <Table
          data={selectOptions['selUserAccts']?.options || []}
          onRowClick={handleSelect}
          columnStyles={{
            label: 'w-2/3',
            value: 'w-1/3'
          }}
        />
      </ModalComponent>
    </div>
  );
};

export default PageHeader;
