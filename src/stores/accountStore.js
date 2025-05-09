import { setVars, getVar, clearAccountData, usePollVar } from '../utils/externalStore';
import { triggerAction } from '../actions/actionStore';
import createLogger from '../utils/logger';
import { execEvent } from './eventStore';
import { APP_SETTINGS } from '../config/settings'; // Make sure this path is correct

const log = createLogger('AccountStore');

// List names - single source of truth
const LIST_NAMES = [
  'ingrTypeList',
  'prodTypeList',
  'vndrList',
  'brndList',
  'wrkrList',
  'measList'
];

// Initialize private state variables for lists
LIST_NAMES.forEach(name => {
  global[name] = [];
});

// Generic list management function
const manageList = async (listName, accountId) => {
  try {
    log.debug(`Loading ${listName}`);
    const acctID = accountId || getVar(':acctID');
    const items = await execEvent(listName, { acctID });
    
    if (Array.isArray(items)) {
      global[listName] = items;
      setVars({ [`:${listName}`]: items });
      log.debug(`${listName} loaded: ${items.length} items`);
      return items;
    }
    
    log.warn(`Invalid ${listName} response`);
    return null;
  } catch (error) {
    log.error(`Error loading ${listName}:`, error);
    return null;
  }
};

// Get reference data by name function
export const getRefDataByName = (listName) => {
  if (!LIST_NAMES.includes(listName)) {
    log.warn(`Invalid list name: ${listName}`);
    return [];
  }
  return getVar(`:${listName}`) || [];
};

// Data loading functions - these are moved from initAccountStore
export const loadAccountData = async (accountId) => {
  log.info('Loading account data', { accountId });
  
  if (!accountId) {
    log.error('No account ID provided, cannot load data');
    return false;
  }
  
  try {
    // Load all data for this account in parallel
    const results = await Promise.all(
      LIST_NAMES.map(listName => manageList(listName, accountId))
    );
    
    const success = results.every(Boolean);
    log.info(`Data loading ${success ? 'completed' : 'partially failed'}`);
    return success;
  } catch (error) {
    log.error('Failed to load account data:', error);
    return false;
  }
};

// Enhanced hook with reactive data polling
export const useAccountStore = () => {
  // Replace non-reactive useState implementation with usePollVar
  const ingrTypeList = usePollVar(':ingrTypeList', []);
  const prodTypeList = usePollVar(':prodTypeList', []);
  const vndrList = usePollVar(':vndrList', []);
  const brndList = usePollVar(':brndList', []);
  const wrkrList = usePollVar(':wrkrList', []);
  const measList = usePollVar(':measList', []);
  
  // Also track current account reactively
  const currentAccount = usePollVar(':acctID', '');
  
  return {
    ingrTypeList,
    prodTypeList,
    vndrList,
    brndList,
    wrkrList,
    measList,
    currentAccount
  };
};

// Export hooks for common use cases
export const useCurrentAccount = () => usePollVar(':acctID', '');
export const useAccountList = () => usePollVar(':userAcctList', []);

// Export list getters/setters
const exports = {};
LIST_NAMES.forEach(name => {
  const getName = `get${name.charAt(0).toUpperCase() + name.slice(1)}`;
  const setName = `set${name.charAt(0).toUpperCase() + name.slice(1)}`;
  exports[getName] = () => getVar(`:${name}`) || [];
  exports[setName] = (accountId) => manageList(name, accountId);
});

// Add the initialization flag here
let isInitializing = false;

export const initAccountStore = async (forceReload = false) => {
  // Check if already initializing
  if (isInitializing && !forceReload) {
    log.warn('Account store initialization already in progress');
    return false;
  }
  
  isInitializing = true;
  const accountId = getVar(':acctID');
  
  log.info('Initializing account store', { accountId });
  
  try {
    // Clear previous account data
    clearAccountData();
    
    if (!accountId) {
      log.error('No account ID found, cannot initialize');
      return false;
    }
    
    // Initialize all data for this account in sequence
    await Promise.all([
      execEvent('ingrTypeList', { acctID: accountId }),
      execEvent('prodTypeList', { acctID: accountId }),
      execEvent('vndrList', { acctID: accountId }),
      execEvent('brndList', { acctID: accountId }),
      execEvent('wrkrList', { acctID: accountId }),
      execEvent('measList', { acctID: accountId })
    ]);
    
    // Signal completion with the specific account ID
    triggerAction('ACCOUNT_INITIALIZED', { accountId });
    return true;
  } catch (error) {
    log.error('Failed to initialize account store:', error);
    return false;
  } finally {
    isInitializing = false;
  }
};

// Add a function to check if lists are loaded
export const ensureListsLoaded = async () => {
  const promises = [];
  const loadedStatus = {};
  
  LIST_NAMES.forEach(name => {
    const list = getVar(`:${name}`);
    loadedStatus[name] = !!list && list.length > 0;
    
    if (!loadedStatus[name]) {
      promises.push(manageList(name));
    }
  });
  
  // Log what's happening
  log.info('List loading status:', loadedStatus);
  
  if (promises.length > 0) {
    log.info(`Loading ${promises.length} missing lists...`);
    await Promise.all(promises);
    return true;
  }
  
  return false; // No lists needed loading
};

// Add this function to load a single list instead of all lists
export const ensureListLoaded = async (listName) => {
  if (!listName) return false;
  
  // Check if already loaded
  const list = getVar(`:${listName}`);
  if (list && list.length > 0) {
    return true; // Already loaded
  }
  
  // Prevent concurrent loading of the same list
  const loadingKey = `:${listName}_loading`;
  if (getVar(loadingKey)) {
    return false; // Already loading
  }
  
  try {
    // Mark as loading
    setVars(loadingKey, true);
    
    // Load the list
    log.info(`Loading list ${listName}...`);
    await manageList(listName);
    
    // Verify it loaded
    const loadedList = getVar(`:${listName}`);
    const success = loadedList && loadedList.length > 0;
    
    log.info(`List ${listName} load ${success ? 'succeeded' : 'failed'}`, {
      itemCount: loadedList?.length || 0
    });
    
    return success;
  } finally {
    // Always reset loading flag
    setVars(loadingKey, false);
  }
};

// Page title management functions
export const getPageTitle = () => getVar(':pageTitle') || APP_SETTINGS.pageTitle;

export const setPageTitle = (title = APP_SETTINGS.pageTitle) => {
  log.debug(`Setting page title: ${title}`);
  setVars({ ':pageTitle': title });
  return title;
};

// React hook for page title
export const usePageTitle = () => usePollVar(':pageTitle', APP_SETTINGS.pageTitle, 1000);

// Updated account switching function that handles navigation and title reset
export const switchAccount = async (accountId, navigate) => {
  try {
    log.info(`Switching to account: ${accountId}`);
    
    // Set the current account
    setCurrentAccount(accountId);
    
    // Reset page title to default
    setPageTitle();
    
    // Initialize/reload account-specific data
    await initAccountStore();
    
    // Navigate to welcome page if navigate function provided
    if (navigate && typeof navigate === 'function') {
      navigate('/welcome');
    }
    
    return true;
  } catch (error) {
    log.error('Error switching accounts:', error);
    return false;
  }
};

// Export list getters/setters from the exports object
export const {
  getIngrTypeList, setIngrTypeList,
  getProdTypeList, setProdTypeList,
  getVndrList, setVndrList,
  getBrndList, setBrndList,
  getWrkrList, setWrkrList,
  getMeasList, setMeasList
} = exports;

// Define missing account functions
const getCurrentAccount = () => getVar(':acctID');
const setCurrentAccount = (accountId) => setVars({ ':acctID': accountId });
const getAccountList = () => getVar(':userAcctList') || [];
const setAccountList = (list) => setVars({ ':userAcctList': list });

// Then keep your export statement at the bottom
export {
  getCurrentAccount,
  setCurrentAccount,
  getAccountList,
  setAccountList
};
