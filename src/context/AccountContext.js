import React, { createContext, useContext, useState } from 'react';

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [acctName, setAcctName] = useState('');

  return (
    <AccountContext.Provider value={{ acctName, setAcctName }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => useContext(AccountContext);
