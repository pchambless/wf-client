import { setVars, getVar, subscribe } from '../utils/externalStore';
import createLogger from '../utils/logger';
import { execEvent } from './eventStore';

const log = createLogger('AccountStore');

// Private state
let currentAccount = null;
let accountList = [];
let ingrTypeList = [];
let prodTypeList = [];
let vndrList = [];
let brndList = [];
let wrkrList = [];
let measList = []; // Add measurement list

// Store keys
const ACCT_CURRENT = ':acctID';
const ACCT_LIST = ':acct.list';
const INGR_TYPE_LIST = ':acct.ingrTypes';
const PROD_TYPE_LIST = ':acct.prodTypes';
const VNDR_LIST = ':acct.vendors';
const BRND_LIST = ':acct.brands';
const WRKR_LIST = ':acct.workers';
const MEAS_LIST = ':acct.measurements'; // Add key for measurements

/**
 * Set current account
 * @param {number|string} accountId - Account ID
 */
export const setCurrentAccount = (accountId) => {
  if (!accountId) return;
  
  log(`Setting current account: ${accountId}`);
  currentAccount = accountId;
  setVars({ [ACCT_CURRENT]: accountId });
};

/**
 * Get current account
 * @returns {number|string|null} Current account ID
 */
export const getCurrentAccount = () => currentAccount;

/**
 * Set account list
 * @param {Array} accounts - List of accounts
 */
export const setAccountList = (accounts) => {
  if (!Array.isArray(accounts)) {
    log.warn('Invalid account list:', accounts);
    return;
  }
  
  log(`Setting account list: ${accounts.length} accounts`);
  accountList = accounts;
  setVars({ [ACCT_LIST]: accounts });
};

/**
 * Get account list
 * @returns {Array} List of accounts
 */
export const getAccountList = () => accountList;

/**
 * Set ingredient type list
 * @param {Array} types - List of ingredient types
 */
export const setIngrTypeList = (types) => {
  if (!Array.isArray(types)) {
    log.warn('Invalid ingredient type list:', types);
    return;
  }
  
  log(`Setting ingredient type list: ${types.length} types`);
  ingrTypeList = types;
  setVars({ [INGR_TYPE_LIST]: types });
};

/**
 * Get ingredient type list
 * @returns {Array} List of ingredient types
 */
export const getIngrTypeList = () => ingrTypeList;

/**
 * Set product type list
 * @param {Array} types - List of product types
 */
export const setProdTypeList = (types) => {
  if (!Array.isArray(types)) {
    log.warn('Invalid product type list:', types);
    return;
  }
  
  log(`Setting product type list: ${types.length} types`);
  prodTypeList = types;
  setVars({ [PROD_TYPE_LIST]: types });
};

/**
 * Get product type list
 * @returns {Array} List of product types
 */
export const getProdTypeList = () => prodTypeList;

/**
 * Set vendor list
 * @param {Array} vendors - List of vendors
 */
export const setVndrList = (vendors) => {
  if (!Array.isArray(vendors)) {
    log.warn('Invalid vendor list:', vendors);
    return;
  }
  
  log(`Setting vendor list: ${vendors.length} vendors`);
  vndrList = vendors;
  setVars({ [VNDR_LIST]: vendors });
};

/**
 * Get vendor list
 * @returns {Array} List of vendors
 */
export const getVndrList = () => vndrList;

/**
 * Set brand list
 * @param {Array} brands - List of brands
 */
export const setBrndList = (brands) => {
  if (!Array.isArray(brands)) {
    log.warn('Invalid brand list:', brands);
    return;
  }
  
  log(`Setting brand list: ${brands.length} brands`);
  brndList = brands;
  setVars({ [BRND_LIST]: brands });
};

/**
 * Get brand list
 * @returns {Array} List of brands
 */
export const getBrndList = () => brndList;

/**
 * Set worker list
 * @param {Array} workers - List of workers
 */
export const setWrkrList = (workers) => {
  if (!Array.isArray(workers)) {
    log.warn('Invalid worker list:', workers);
    return;
  }
  
  log(`Setting worker list: ${workers.length} workers`);
  wrkrList = workers;
  setVars({ [WRKR_LIST]: workers });
};

/**
 * Get worker list
 * @returns {Array} List of workers
 */
export const getWrkrList = () => wrkrList;

/**
 * Set measurement list
 * @param {Array} measurements - List of measurements
 */
export const setMeasList = (measurements) => {
  if (!Array.isArray(measurements)) {
    log.warn('Invalid measurement list:', measurements);
    return;
  }
  
  log(`Setting measurement list: ${measurements.length} measurements`);
  measList = measurements;
  setVars({ [MEAS_LIST]: measurements });
};

/**
 * Get measurement list
 * @returns {Array} List of measurements
 */
export const getMeasList = () => measList;

/**
 * Get reference data by list name
 * @param {string} listName - Name of the reference list
 * @returns {Array} Reference data list
 */
export const getRefDataByName = (listName) => {
  if (!listName) {
    log.warn('getRefDataByName called with no listName');
    return [];
  }
  
  // Map list names to their corresponding getter functions - strict naming only
  const getterMap = {
    'measList': getMeasList,
    'vndrList': getVndrList,
    'brndList': getBrndList,
    'wrkrList': getWrkrList,
    'ingrTypeList': getIngrTypeList,
    'prodTypeList': getProdTypeList
  };
  
  // Get the appropriate getter function
  const getter = getterMap[listName];
  
  if (typeof getter === 'function') {
    const data = getter();
    log(`Retrieved reference data for ${listName}: ${data.length} items`);
    return data;
  }
  
  log.warn(`No getter found for reference data list: ${listName}`);
  return [];
};

/**
 * Load all account-specific reference data
 * @param {number|string} accountId - Account ID to load data for
 * @returns {Promise<void>}
 */
const loadAccountReferenceData = async (accountId) => {
  try {
    log(`Loading all reference data for account ${accountId}`);

    // Load ingredient types
    log('Loading ingredient types');
    const ingrTypes = await execEvent('ingrTypeList', { [ACCT_CURRENT]: accountId });
    setIngrTypeList(ingrTypes || []);
    
    // Load product types
    log('Loading product types');
    const prodTypes = await execEvent('prodTypeList', { [ACCT_CURRENT]: accountId });
    setProdTypeList(prodTypes || []);
    
    // Load vendors
    log('Loading vendors');
    const vendors = await execEvent('vndrList', { [ACCT_CURRENT]: accountId });
    setVndrList(vendors || []);
    
    // Load brands
    log('Loading brands');
    const brands = await execEvent('brndList', { [ACCT_CURRENT]: accountId });
    setBrndList(brands || []);
    
    // Load workers
    log('Loading workers');
    const workers = await execEvent('wrkrList', { [ACCT_CURRENT]: accountId });
    setWrkrList(workers || []);
    
    // Load measurements
    log('Loading measurements');
    const measurements = await execEvent('measList', { [ACCT_CURRENT]: accountId });
    setMeasList(measurements || []);
    
    log(`Successfully loaded all reference data for account ${accountId}`);
  } catch (error) {
    log.error(`Error loading reference data for account ${accountId}:`, error);
    throw error;
  }
};

/**
 * Initialize account store for a specific account
 * @param {number|string} accountId - Account ID to initialize
 * @returns {Promise<boolean>} Success status
 */
export const initAccountStore = async (accountId) => {
  log(`Initializing account store with account ID: ${accountId}`);
  
  try {
    // Set current account
    setCurrentAccount(accountId);
    
    // Load all reference data for this account
    await loadAccountReferenceData(accountId);
    
    // Signal successful initialization
    log(`Account store initialized successfully for account ${accountId}`);
    return true;
  } catch (error) {
    log.error(`Error initializing account store for account ${accountId}:`, error);
    return false;
  }
};

/**
 * React hook for using account data in components
 * @returns {object} Account state and methods
 */
export const useAccountStore = () => {
  const { useState, useEffect } = require('react');
  
  // Initialize state from current values
  const [state, setState] = useState({
    currentAccount: getCurrentAccount(),
    accountList: getAccountList(),
    ingrTypeList: getIngrTypeList(),
    prodTypeList: getProdTypeList(),
    vndrList: getVndrList(),
    brndList: getBrndList(),
    wrkrList: getWrkrList(),
    measList: getMeasList() // Add measList to state
  });
  
  // Subscribe to changes
  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setState({
        currentAccount: getCurrentAccount(),
        accountList: getAccountList(),
        ingrTypeList: getIngrTypeList(),
        prodTypeList: getProdTypeList(),
        vndrList: getVndrList(),
        brndList: getBrndList(),
        wrkrList: getWrkrList(),
        measList: getMeasList() // Add measList to state updates
      });
    });
    
    return unsubscribe;
  }, []);
  
  return {
    currentAccount: state.currentAccount,
    accountList: state.accountList || [],
    ingrTypeList: state.ingrTypeList || [],
    prodTypeList: state.prodTypeList || [],
    vndrList: state.vndrList || [],
    brndList: state.brndList || [],
    wrkrList: state.wrkrList || [],
    measList: state.measList || [], // Add measList to return object
    setCurrentAccount,
    switchAccount: setCurrentAccount, // Alias for clarity
    initAccountStore
  };
};

// Initialize store
(() => {
  // Set initial values in external store if not already set
  if (getVar(ACCT_CURRENT) === undefined) {
    setVars({
      [ACCT_CURRENT]: null,
      [ACCT_LIST]: [],
      [INGR_TYPE_LIST]: [],
      [PROD_TYPE_LIST]: [],
      [VNDR_LIST]: [],
      [BRND_LIST]: [],
      [WRKR_LIST]: [],
      [MEAS_LIST]: [] // Initialize measList
    });
  } else {
    // Restore from external store
    currentAccount = getVar(ACCT_CURRENT);
    accountList = getVar(ACCT_LIST) || [];
    ingrTypeList = getVar(INGR_TYPE_LIST) || [];
    prodTypeList = getVar(PROD_TYPE_LIST) || [];
    vndrList = getVar(VNDR_LIST) || [];
    brndList = getVar(BRND_LIST) || [];
    wrkrList = getVar(WRKR_LIST) || [];
    measList = getVar(MEAS_LIST) || []; // Restore measList
  }
})();
