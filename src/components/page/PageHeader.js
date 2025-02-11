import React, { useState, useCallback } from 'react';
import { setVars } from '../../utils/externalStore';
import { useGlobalContext } from '../../context/GlobalContext';
import createLogger from '../../utils/logger';
import logo from '../../assets/wf-icon.png';
import Select from './Select'; // Import the Select component
import { useNavigate } from 'react-router-dom';

const PageHeader = () => {
  const log = createLogger('PageHeader');
  const { pageTitle, userID } = useGlobalContext();
  const navigate = useNavigate();

  const [selectedArea, setSelectedArea] = useState('defineBusiness');
  const [batchType, setBatchType] = useState('ingr'); // New state to track batch type prefix
  const [selects, setSelects] = useState([
    { value: '', options: [], placeholder: 'Select Type', varName: 'typeID', listEvent: `${batchType}TypeList` },
    { value: '', options: [], placeholder: 'Select Entity', varName: 'entityID', listEvent: `${batchType}List`, visible: false },
  ]);

  const handleAccountChange = (value) => {
    setVars(':acctID', value);
  };

  const handleLogout = () => {
    log('Logging out');
    localStorage.clear();
    navigate('/login');
  };

  const handleAreaChange = (area) => {
    setSelectedArea(area);
  };

  const updateSelects = async (index, value) => {
    const newSelects = [...selects];
    newSelects[index].value = value;

    // Show the next select widget
    if (index < selects.length - 1) {
      newSelects[index + 1].visible = true;
    } else {
      // Navigate to the batch list page
      const batchListPath = batchType === 'ingr' ? `/ingredientBatches/${value}` : `/productBatches/${value}`;
      navigate(batchListPath);
    }

    setSelects(newSelects);
  };

  log('Rendering');

  return (
    <div>
      <header className="flex items-center justify-between p-4 bg-gray-100 border-b border-[#008060] rounded-lg shadow-md">
        <div className="flex items-center">
          <img src={logo} alt="Whatsfresh Logo" className="w-12 h-12 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
        </div>
        <div className="flex items-center justify-center flex-1">
          <Select
            eventType="userAcctList"
            placeholder="Select Account"
            onChange={handleAccountChange}
            params={{ ':userID': userID }} // Pass userID with ':' as a parameter
          />
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>
      <div className="flex justify-center my-4">
        <button
          onClick={() => handleAreaChange('defineBusiness')}
          className={`px-4 py-2 mx-2 ${selectedArea === 'defineBusiness' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} rounded`}
        >
          Define My Business
        </button>
        <button
          onClick={() => handleAreaChange('recordBatches')}
          className={`px-4 py-2 mx-2 ${selectedArea === 'recordBatches' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} rounded`}
        >
          Record My Batches
        </button>
      </div>
    </div>
  );
};

export default React.memo(PageHeader);
