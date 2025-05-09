import { getVar, setVars, clearAccountData } from './externalStore';
import accountStore from '../stores/accountStore'; // Import the store itself
import { setPageTitle } from '../stores/pageStore';
import { triggerAction } from '../actions/actionStore';
import createLogger from './logger';

const log = createLogger('AccountManager');

/**
 * Set or switch account - handles both initial account and account switching
 */
export const setAccount = async (accountId) => {
  const currentAccount = getVar(':acctID');
  const isInitialSetup = !currentAccount;
  
  if (accountId === currentAccount) {
    log.info('Account unchanged', { accountId });
    return true;
  }
  
  // Use appropriate logging based on whether this is initial setup or a change
  if (isInitialSetup) {
    log.info('Setting initial account', { accountId });
  } else {
    log.info('Switching account', { from: currentAccount, to: accountId });
  }
  
  try {
    // Clear any existing account data first (if not initial setup)
    if (!isInitialSetup) {
      clearAccountData();
    }
    
    // Set the account ID in both MobX and external store
    accountStore.setCurrentAcctID(accountId);
    setVars({ ':acctID': accountId });
    
    // Reset page title to default
    setPageTitle();
    
    // Load all required account data
    const success = await accountStore.initializeAcctData(true);
    
    if (!success) {
      throw new Error('Failed to load account data');
    }
    
    // Notify all components
    const eventType = isInitialSetup ? 'ACCOUNT_INITIALIZED' : 'ACCOUNT_CHANGED';
    triggerAction(eventType, { 
      previousAccount: currentAccount,
      newAccount: accountId 
    });
    
    return true;
  } catch (error) {
    log.error(`Error ${isInitialSetup ? 'setting' : 'switching'} account:`, error);
    
    // Revert to previous account if this wasn't initial setup
    if (!isInitialSetup && currentAccount) {
      setVars({ ':acctID': currentAccount });
      accountStore.setCurrentAcctID(currentAccount);
    }
    
    return false;
  }
};

/**
 * Get formatted account info for display
 */
export const getCurrentAccountInfo = () => {
  const acctID = getVar(':acctID');
  const acctList = getVar(':userAcctList') || [];
  
  // Ensure consistent type comparison
  const account = acctList.find(a => 
    String(a.acctID) === String(acctID)
  );
  
  // Add debug logging
  log.debug('Account info lookup', {
    currentId: acctID,
    idType: typeof acctID,
    accountFound: !!account,
    accountList: acctList.map(a => ({ id: a.acctID, name: a.acctName }))
  });
  
  return {
    id: acctID,
    name: account ? account.acctName : "Unknown Account",
    exists: !!account
  };
};

/**
 * Handle user login and initial account setup
 */
export const setupUserAccount = async (userData, accountList, defaultAccountId) => {
  try {
    log.info('Setting up user account', { 
      userId: userData.userID,
      defaultAccountId
    });
    
    // Set user in store
    accountStore.setUser(userData);
    accountStore.setUserAcctList(accountList);
    accountStore.setCurrentAcctID(defaultAccountId);
    
    // Set vars for backward compatibility
    setVars({ 
      ':userID': userData.userID, 
      ':roleID': userData.roleID, 
      ':userEmail': userData.userEmail,
      ':lastName': userData.lastName, 
      ':firstName': userData.firstName, 
      ':isAuth': "1",
      ':acctID': String(defaultAccountId),
      ':userAcctList': accountList
    });
    
    // Now fully initialize the account
    const success = await accountStore.initializeAcctData(true);
    
    if (success) {
      triggerAction('ACCOUNT_INITIALIZED', { accountId: defaultAccountId });
      return true;
    } else {
      log.error('Failed to load account data');
      return false;
    }
  } catch (error) {
    log.error('Error setting up user account:', error);
    return false;
  }
};

/**
 * Initialize account data after login
 * This only loads reference data, doesn't set user info
 */
export const initAcctData = async (accountId) => {
  try {
    log.info('Initializing account data', { accountId });
    
    // Set current account and load data
    accountStore.setCurrentAcctID(accountId);
    const success = await accountStore.initializeAcctData(true);
    
    if (success) {
      triggerAction('ACCOUNT_DATA_LOADED', { accountId });
      return true;
    } else {
      log.error('Failed to load account data');
      return false;
    }
  } catch (error) {
    log.error('Error initializing account data:', error);
    return false;
  }
};

// Update exported object
const accountManager = {
  setAccount,
  getCurrentAccountInfo,
  setupUserAccount,
  initAcctData
};

export default accountManager;
