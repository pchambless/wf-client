import { setVars, getVar, subscribe } from '../utils/externalStore';
import createLogger from '../utils/logger';

const log = createLogger('SessionStore');

// Private state
let currentUser = null;
let authenticated = false;
let accountList = []; // Add account list

// Store keys
const AUTH_USER = ':session.user';
const AUTH_STATE = ':session.authenticated';
const USER_ACCT_LIST = ':session.accountList'; // New key for account list

/**
 * Set user session data
 * @param {object} user - User data
 * @param {array} [userAccounts] - Optional list of accounts the user has access to
 */
export const setUserSession = (user, userAccounts = []) => {
  log('Setting user session', { user, accountCount: userAccounts.length });
  
  // Update local state
  currentUser = user;
  authenticated = !!user && !!user.isAuthenticated;
  
  // If accounts are provided, update the account list
  if (userAccounts && Array.isArray(userAccounts)) {
    accountList = userAccounts;
  }
  
  // Update external store
  setVars({
    [AUTH_USER]: user,
    [AUTH_STATE]: authenticated ? "1" : "0",
    [USER_ACCT_LIST]: accountList
  });
};

/**
 * Get current user data
 * @returns {object|null} Current user data
 */
export const getCurrentUser = () => currentUser;

/**
 * Get user account list
 * @returns {array} List of accounts the user has access to
 */
export const getUserAccountList = () => accountList;

/**
 * Set the user account list
 * @param {array} accounts - List of accounts the user has access to
 */
export const setUserAccountList = (accounts) => {
  if (!Array.isArray(accounts)) {
    log.warn('Invalid account list:', accounts);
    return;
  }
  
  log(`Setting user account list: ${accounts.length} accounts`);
  accountList = accounts;
  setVars({ [USER_ACCT_LIST]: accounts });
};

/**
 * Load the account list for the current user
 * @returns {Promise<Array>} The list of user accounts
 */
export const loadUserAccountList = async () => {
  try {
    const user = getCurrentUser();
    console.log('DEBUGGING - loadUserAccountList called:', { user });
    
    if (!user || !user.userID) {
      log.warn('Cannot load account list - no user logged in');
      console.log('DEBUGGING - No user found in loadUserAccountList');
      return [];
    }
    
    log(`Loading account list for user ${user.userID}`);
    console.log(`DEBUGGING - Loading accounts for user ${user.userID}`);
    
    // Use the eventStore directly
    const { execEvent } = require('./eventStore');
    
    // Make sure the event name is correct - it might be 'userAcctList' or something else
    console.log('DEBUGGING - About to call execEvent for userAcctList');
    const accounts = await execEvent('userAcctList', { ':userID': user.userID });
    console.log('DEBUGGING - execEvent response:', accounts);
    
    if (!Array.isArray(accounts)) {
      log.warn('Invalid account list response format:', accounts);
      console.log('DEBUGGING - Invalid account response format:', accounts);
      return [];
    }
    
    log(`Loaded ${accounts.length} accounts for user ${user.userID}`);
    console.log(`DEBUGGING - Loaded ${accounts.length} accounts:`, accounts);
    
    // Update the account list in the store
    setUserAccountList(accounts);
    
    return accounts;
  } catch (error) {
    log.error('Error loading user account list:', error);
    console.error('DEBUGGING - Error in loadUserAccountList:', error);
    return [];
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication state
 */
export const isAuthenticated = () => authenticated;

/**
 * End user session (logout)
 */
export const endUserSession = () => {
  log('Ending user session');
  
  // Clear local state
  currentUser = null;
  authenticated = false;
  accountList = [];
  
  // Update external store
  setVars({
    [AUTH_USER]: null,
    [AUTH_STATE]: "0",
    [USER_ACCT_LIST]: []
  });
};

/**
 * Initialize session store
 * @returns {Promise<boolean>} Success status
 */
export const initSessionStore = async () => {
  log('Initializing session store');
  
  try {
    // If authenticated but no account list, load it
    if (authenticated && (accountList.length === 0)) {
      log('Loading user account list as part of session store initialization');
      await loadUserAccountList();
    } else if (!authenticated) {
      log('Cannot load account list - user not authenticated');
    } else {
      log('Account list already loaded - skipping');
    }
    
    // Add any other session initialization tasks here
    
    return true;
  } catch (error) {
    log.error('Error initializing session store:', error);
    return false;
  }
};

/**
 * React hook for using session data in components
 * @returns {object} Session state and methods
 */
export const useSessionStore = () => {
  const { useState, useEffect } = require('react');
  
  // Initialize state from current values
  const [authState, setAuthState] = useState({
    user: currentUser,
    isAuthenticated: authenticated,
    accountList: accountList
  });
  
  // Add debugging for initial state
  console.log('DEBUGGING useSessionStore - Initial state:', {
    user: currentUser,
    authenticated,
    accountList,
    accountListLength: accountList?.length
  });
  
  // Subscribe to changes
  useEffect(() => {
    const unsubscribe = subscribe(() => {
      const newUser = getVar(AUTH_USER);
      const newAuthState = getVar(AUTH_STATE) === "1";
      const newAccountList = getVar(USER_ACCT_LIST) || [];
      
      console.log('DEBUGGING useSessionStore - Store updated:', {
        newUser,
        newAuthState,
        newAccountList,
        newAccountListLength: newAccountList?.length
      });
      
      // Only update if something changed
      if (JSON.stringify(newUser) !== JSON.stringify(authState.user) || 
          newAuthState !== authState.isAuthenticated ||
          JSON.stringify(newAccountList) !== JSON.stringify(authState.accountList)) {
        setAuthState({
          user: newUser,
          isAuthenticated: newAuthState,
          accountList: newAccountList
        });
      }
    });
    
    return unsubscribe;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    accountList: authState.accountList || [], // Ensure we always return an array
    setUserSession,
    setUserAccountList,
    endUserSession
  };
};

// Initialize store
(() => {
  // Set initial values in external store if not already set
  if (getVar(AUTH_USER) === undefined) {
    setVars({
      [AUTH_USER]: null,
      [AUTH_STATE]: "0",
      [USER_ACCT_LIST]: []
    });
  } else {
    // Restore session from external store
    currentUser = getVar(AUTH_USER);
    authenticated = getVar(AUTH_STATE) === "1";
    accountList = getVar(USER_ACCT_LIST) || [];
  }
})();
