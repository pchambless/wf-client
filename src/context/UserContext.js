import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState('');
  const [accounts, setAccounts] = useState([]);

  return (
    <UserContext.Provider
      value={{ userEmail, setUserEmail, accounts, setAccounts }}
    >
      {children}
    </UserContext.Provider>
  );
};
