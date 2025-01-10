import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVariableContext } from '../context/VariableContext';
import { usePageContext } from '../context/PageContext';
import logo from '../assets/wf-icon.png';
import AppNav from './AppNav';
import useLogger from '../hooks/useLogger';
import useModalManager from '../utils/modalManager';

const PageHeader = () => {
  const logAndTime = useLogger('PageHeader');
  const { pageTitle } = usePageContext();
  const { fetchVariable } = useVariableContext();
  const [acctName, setAcctName] = useState('');
  const navigate = useNavigate();
  const { openModal } = useModalManager();

  useEffect(() => {
    const fetchedAcctName = fetchVariable(':acctName');
    if (fetchedAcctName) {
      setAcctName(fetchedAcctName);
    }
  }, [fetchVariable]);

  const handleOpenModal = useCallback(() => {
    logAndTime('Opening userAccts modal');
    openModal('userAccts');
  }, [logAndTime, openModal]);

  const handleLogout = useCallback(() => {
    logAndTime('Logging out');
    localStorage.clear();
    navigate('/');
  }, [navigate, logAndTime]);

  logAndTime('PageHeader rendering');

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
            onClick={handleOpenModal}
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
    </div>
  );
};

export default React.memo(PageHeader);
