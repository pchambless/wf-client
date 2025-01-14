import React, { createContext, useContext, useState } from 'react';
import { getVar, setVars } from '../utils/externalStore';
import Login from '../pages/Login'; // Import your Login page

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userID, setUserID] = useState(getVar(':userID') || '');
  const [userEmail, setUserEmail] = useState(getVar(':userEmail') || '');
  const [roleID, setRoleID] = useState(getVar('roleID') || '');
  const [acctID, setAcctID] = useState(getVar(':acctID') || '');
  const [acctName, setAcctName] = useState(getVar(':acctName') || '');

  const updateState = (setter, key, value) => {
    setter(value);
    setVars({ [key]: value });
  };

  // Group functions and constants related to user
  const userPages = {
    login: Login,
    loginTitle: 'Login',
  };

  return (
    <UserContext.Provider value={{
      userID, setUserID: (value) => updateState(setUserID, ':userID', value),
      userEmail, setUserEmail: (value) => updateState(setUserEmail, ':userEmail', value),
      roleID, setRoleID: (value) => updateState(setRoleID, 'roleID', value),
      acctID, setAcctID: (value) => updateState(setAcctID, ':acctID', value),
      acctName, setAcctName: (value) => updateState(setAcctName, ':acctName', value),
      userPages
    }}>
      {children}
    </UserContext.Provider>
  );
};
