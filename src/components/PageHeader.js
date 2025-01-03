import React, { useEffect, useState, useCallback } from 'react';
import Select from '../components/Select';
import { useUserContext } from '../context/UserContext';
import { useEventTypeContext } from '../context/EventTypeContext';
import { useVariableContext } from '../context/VariableContext'; // Import VariableContext
import logo from '../assets/wf-icon.png';
import { useNavigate } from 'react-router-dom';
import AppNav from '../components/AppNav';

const PageHeader = () => {
  const fileName = 'PageHeader: ';
  const { setUserEmail, userEmail } = useUserContext();
  const { getEventTypeData, buildRequestBody, execEventType } = useEventTypeContext();
  const { variables, setVariable } = useVariableContext(); 
  const [accountOptions, setAccountOptions] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserEmail('');
    localStorage.clear();
    navigate('/');
  };

  const fetchAccounts = useCallback(async () => {
    try {
      console.log(fileName, 'Fetching accounts for userEmail:', userEmail);
      const eventTypeData = getEventTypeData('userAccts');
      if (!eventTypeData) {
        throw new Error(fileName + 'Event type data not found for userAccts');
      }
      console.log(fileName, 'Fetched event type data:', eventTypeData);
      const requestBody = buildRequestBody(eventTypeData, { userEmail });
      console.log(fileName, 'Request body:', JSON.stringify(requestBody, null, 2));
      const response = await execEventType(requestBody.eventType, requestBody.params);
      console.log(fileName, 'Full response:', JSON.stringify(response, null, 2));

      if (response && Array.isArray(response)) {
        const mappedOptions = response.map(account => ({
          id: account.acct_id,
          label: account.account_name,
        }));
        console.log(fileName, 'Mapped options:', JSON.stringify(mappedOptions, null, 2));
        setAccountOptions(mappedOptions);
      } else if (response && response.data) {
        const mappedOptions = response.data.map(account => ({
          id: account.acct_id,
          label: account.account_name,
        }));
        console.log(fileName, 'Mapped options:', JSON.stringify(mappedOptions, null, 2));
        setAccountOptions(mappedOptions);
      } else {
        throw new Error(fileName + 'Invalid response structure: data property not found');
      }
    } catch (error) {
      console.error(fileName, 'Error fetching accounts:', error);
    }
  }, [userEmail, buildRequestBody, getEventTypeData, execEventType]);

  const handleFocus = () => {
    console.log(fileName, 'Select widget focused');
    fetchAccounts();
  };

  const handleChange = (value) => {
    console.log(fileName, 'Selected Account:', value);
    setVariable('acctID', value); // Update the selected account ID in the VariableContext
  };

  useEffect(() => {
    console.log(fileName, 'Account options state updated:', accountOptions);
  }, [accountOptions]);

  useEffect(() => {
    if (variables.acctID) {
      console.log(fileName, 'Selected Account ID:', variables.acctID);
    }
  }, [variables.acctID]);

  return (
    <div>
      <header className="flex items-center justify-between p-4 bg-gray-100 border-b">
        <div className="flex items-center">
          <img src={logo} alt="Whatsfresh Logo" className="w-12 h-12 mr-2" />
          <h1 className="text-2xl font-bold">Page Name</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            options={accountOptions}
            label="Select Account"
            valueKey="id"
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
