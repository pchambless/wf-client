import React, { createContext, useContext, useState, useCallback } from 'react';
import { setVars, getVar, clearAllVars } from '../utils/externalStore';
import { clearCachedLists, fetchAcctLists } from '../utils/acctLists';

const AccountContext = createContext();

export const useAccountContext = () => useContext(AccountContext);

export const AccountProvider = ({ children }) => {
  const [selectedAccount, setSelectedAccount] = useState(getVar(':acctID') || null); // Initialize with :acctID from externalStore

  const setAccount = useCallback((acctID) => {
    setSelectedAccount(acctID);
    setVars({ ':acctID': acctID });
  }, []);

  const logout = useCallback(() => {
    clearAllVars();
    clearCachedLists();
    setSelectedAccount(null); // Reset selectedAccount state
  }, []);

  const fetchAndCacheLists = useCallback(async (execEvent) => {
    try {
      await fetchAcctLists(execEvent);
    } catch (error) {
      console.error('Failed to fetch and cache lists:', error);
    }
  }, []);

  return (
    <AccountContext.Provider value={{
      selectedAccount, setAccount,
      logout,
      fetchAndCacheLists // Provide fetchAndCacheLists in the context
    }}>
      {children}
    </AccountContext.Provider>
  );
};
