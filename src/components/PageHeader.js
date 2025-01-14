import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogger from '../hooks/useLogger';
import { usePageContext } from '../context/PageContext';
import { useModalContext } from '../context/ModalContext';
import logo from '../assets/wf-icon.png';
import AppNav from './AppNav';

import { getVar, useExternalStore } from '../utils/externalStore';

const PageHeader = () => {
  const logAndTime = useLogger('PageHeader');
  const { pageTitle } = usePageContext();
  const navigate = useNavigate();
  const { openModal } = useModalContext();

  const [hdrAcctName, setHdrAcctName] = useState('');
  const storeState = useExternalStore();

  const fetchAcctName = useCallback(() => {
    try {
      logAndTime('Fetching account name...');
      const acctName = getVar(':acctName');
      logAndTime(`Account name fetched: ${acctName}`);
      setHdrAcctName(acctName || 'Unknown Account');
    } catch (error) {
      logAndTime('Error fetching account name:', error);
    }
  }, [logAndTime]);

  useEffect(() => {
    fetchAcctName();
  }, [storeState, fetchAcctName]);
  
  const handleOpenModal = () => {
    logAndTime('Opening userAccts modal');
    openModal('userAccts');
  };

  const handleOpenTestMessageModal = () => {
    logAndTime('Opening test message modal');
    openModal('deleteConfirm');
  };

  const handleLogout = () => {
    logAndTime('Logging out');
    localStorage.clear();
    navigate('/');
  };

  logAndTime('PageHeader rendering', { hdrAcctName, pageTitle });

  if (!hdrAcctName) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <header className="flex items-center justify-between p-4 bg-gray-100 border-b border-[#008060] rounded-lg shadow-md">
        <div className="flex items-center">
          <img src={logo} alt="Whatsfresh Logo" className="w-12 h-12 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
        </div>
        <div className="flex items-center justify-center flex-1">
          <h2 className="text-3xl font-semibold text-ingredient-brdr">{hdrAcctName}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Select Account
          </button>
          <button
            onClick={handleOpenTestMessageModal}
            className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
          >
            Test Message Modal
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
