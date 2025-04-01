import { setVars, getVar } from '../utils/externalStore';
import createLogger from '../utils/logger';
import { execEvent } from './eventStore';
import { useState } from 'react';

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

// Initialize private state variables for lists only
LIST_NAMES.forEach(name => {
  global[name] = [];
});

// Generic list management function
const manageList = async (listName) => {
  try {
    log.debug(`Loading ${listName}`);
    const items = await execEvent(listName);
    
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
const getRefDataByName = (listName) => {
  if (!LIST_NAMES.includes(listName)) {
    log.warn(`Invalid list name: ${listName}`);
    return [];
  }
  return getVar(`:${listName}`) || [];
};

// Account management functions
const getCurrentAccount = () => getVar(':acctID');
const setCurrentAccount = (accountId) => setVars({ ':acctID': accountId });
const getAccountList = () => getVar(':userAcctList') || [];
const setAccountList = (list) => setVars({ ':userAcctList': list });

// Simplified initAccountStore - just loads lists
const initAccountStore = async () => {
  log.info('Initializing account store');
  
  try {
    // Load all lists in parallel
    const results = await Promise.all(
      LIST_NAMES.map(name => manageList(name))
    );

    // Log results
    results.forEach((items, index) => {
      log.debug(`${LIST_NAMES[index]} loaded:`, {
        count: Array.isArray(items) ? items.length : 0
      });
    });

    return results.every(result => Array.isArray(result));
  } catch (error) {
    log.error('Error initializing account store:', error);
    return false;
  }
};

// Simplified hook - only manages list data
const useAccountStore = () => {
  const [state] = useState(() => 
    LIST_NAMES.reduce((acc, name) => {
      acc[name] = getVar(`:${name}`) || [];
      return acc;
    }, {})
  );

  return state;
};

// Export list getters/setters
const exports = {};
LIST_NAMES.forEach(name => {
  const getName = `get${name.charAt(0).toUpperCase() + name.slice(1)}`;
  const setName = `set${name.charAt(0).toUpperCase() + name.slice(1)}`;
  exports[getName] = () => getVar(`:${name}`) || [];
  exports[setName] = () => manageList(name);
});

// Export everything
export const {
  getIngrTypeList, setIngrTypeList,
  getProdTypeList, setProdTypeList,
  getVndrList, setVndrList,
  getBrndList, setBrndList,
  getWrkrList, setWrkrList,
  getMeasList, setMeasList
} = exports;

export {
  getCurrentAccount,
  setCurrentAccount,
  getAccountList,
  setAccountList,
  getRefDataByName,
  initAccountStore,
  useAccountStore
};
