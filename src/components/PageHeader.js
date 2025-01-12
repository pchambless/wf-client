import React from 'react';
import Modal from './CustomModal';
import useLogger from '../hooks/useLogger';
import { useNavigate } from 'react-router-dom';
import { usePageContext } from '../context/PageContext';
import logo from '../assets/wf-icon.png';
import AppNav from './AppNav';
import useModalManager from '../modal/modalManager';
import useExternalStore from '../utils/useExternalStore';

const PageHeader = () => {
  const logAndTime = useLogger('PageHeader');
  const { pageTitle } = usePageContext();
  const variables = useExternalStore();
  const navigate = useNavigate();
  const { openModal, closeModal, modalState } = useModalManager();

  const acctName = variables[':acctName'];

  const handleOpenModal = () => {
    logAndTime('Opening userAccts modal');
    openModal('userAccts');
  };

  const handleLogout = () => {
    logAndTime('Logging out');
    localStorage.clear();
    navigate('/');
  };

  logAndTime('PageHeader rendering', { acctName, pageTitle });

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
            Select Account
          </button>
          <button onClick={handleLogout} className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">
            Logout
          </button>
        </div>
      </header>
      <AppNav />
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.config?.title}
        content={modalState.config?.content}
        contentType={modalState.config?.type}
        listEvent={modalState.config?.listEvent}
      />
    </div>
  );
};

export default React.memo(PageHeader);
