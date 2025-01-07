import React, { useEffect, useState, useCallback } from 'react';
import Select from '../components/Select';
import { useUserContext } from '../context/UserContext';
import { useVariableContext } from '../context/VariableContext';
import { useSelectContext } from '../context/SelectContext';
import logo from '../assets/wf-icon.png';
import { useNavigate } from 'react-router-dom';
import AppNav from '../components/AppNav';
import { usePageContext } from '../context/PageContext';
import '../styles/tailwind.css';

const PageHeader = () => {
  const fileName = 'PageHeader: ';
  console.log(fileName, 'Entered.');
  const { setUserEmail } = useUserContext(); // No need to destructure userEmail
  const { selectOptions, fetchSelectOptions } = useSelectContext();
  const { pageTitle } = usePageContext();
  const { setVariable } = useVariableContext();
  const [acctName, setAcctName] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserEmail('');
    localStorage.clear();
    navigate('/');
  };

  const fetchAccounts = useCallback(() => {
    fetchSelectOptions('selUserAccts');
  }, [fetchSelectOptions]);

  const handleFocus = () => {
    console.log(fileName, 'Select widget focused');
    fetchAccounts();
  };

  const handleChange = (value) => {
    console.log(fileName, 'Selected Account:', value);
    const selectedAccount = selectOptions['selUserAccts']?.find(account => account.value === value);
    const accountName = selectedAccount?.label || '';
    setAcctName(accountName);
    setVariable('acctID', value);
    setVariable('acctName', accountName);
  };

  useEffect(() => {
    console.log(fileName, 'Account options state updated:', selectOptions['selUserAccts']);
  }, [selectOptions]);

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
          <Select
            options={selectOptions['selUserAccts']}
            label="Select Account"
            valueKey="value"
            labelKey="label"
            onChange={handleChange}
            onFocus={handleFocus}
            name="selUserAccts"
          />
          <button onClick={handleLogout} className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700">
            Logout
          </button>
        </div>
      </header>
      <AppNav />
    </div>
  );
};

export default PageHeader;
