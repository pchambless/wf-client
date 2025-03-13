// Update the accountStore.js file

import createLogger from '../utils/logger';
import { execEvent } from './eventStore';
import { setVars, getVar } from '../utils/externalStore';

const log = createLogger('AccountStore');

// State
let currentAccount = null;
let accountList = [];
let ingrTypeList = [];
let prodTypeList = [];
let vndrList = [];
let brndList = [];
let wrkrList = [];

/**
 * Set current account
 * @param {string|number} accountId - Account ID
 */
export const setCurrentAccount = (accountId) => {
  currentAccount = accountId;
  log('Current account set:', accountId);
};

/**
 * Get current account
 * @returns {string|number|null} Current account ID
 */
export const getCurrentAccount = () => currentAccount;

/**
 * Set account list
 * @param {Array} accounts - List of user accounts
 */
export const setAccountList = (accounts) => {
  accountList = [...accounts];
  log('Account list updated', { count: accounts.length });
};

/**
 * Get account list
 * @returns {Array} List of user accounts
 */
export const getAccountList = () => [...accountList];

/**
 * Set ingredient type list
 * @param {Array} list - Ingredient types
 */
export const setIngrTypeList = (list) => {
  ingrTypeList = [...list];
  log('Ingredient type list updated', { count: list.length });
};

/**
 * Get ingredient type list
 * @returns {Array} Ingredient types
 */
export const getIngrTypeList = () => [...ingrTypeList];

/**
 * Set product type list
 * @param {Array} list - Product types
 */
export const setProdTypeList = (list) => {
  prodTypeList = [...list];
  log('Product type list updated', { count: list.length });
};

/**
 * Get product type list
 * @returns {Array} Product types
 */
export const getProdTypeList = () => [...prodTypeList];

/**
 * Set vendor list
 * @param {Array} list - Vendors
 */
export const setVndrList = (list) => {
  vndrList = [...list];
  log('Vendor list updated', { count: list.length });
};

/**
 * Get vendor list
 * @returns {Array} Vendors
 */
export const getVndrList = () => [...vndrList];

/**
 * Set brand list
 * @param {Array} list - Brands
 */
export const setBrndList = (list) => {
  brndList = [...list];
  log('Brand list updated', { count: list.length });
};

/**
 * Get brand list
 * @returns {Array} Brands
 */
export const getBrndList = () => [...brndList];

/**
 * Set worker list
 * @param {Array} list - Workers
 */
export const setWrkrList = (list) => {
  wrkrList = [...list];
  log('Worker list updated', { count: list.length });
};

/**
 * Get worker list
 * @returns {Array} Workers
 */
export const getWrkrList = () => [...wrkrList];

/**
 * Load user account list
 * @returns {Promise<Array>} Account list
 */
export const loadUserAccountList = async () => {
  try {
    log('Loading user account list');
    const userID = getVar(':userID');
    const result = await execEvent('userAcctList', { ':userID': userID });
    setAccountList(result);
    log('User account list loaded successfully', { count: result.length });
    return result;
  } catch (error) {
    log.error('Error loading user account list:', error);
    throw error;
  }
};

/**
 * Initialize account store with account-specific data
 * @param {string|number} accountId - Account ID to initialize
 */
export const initAccountStore = async (accountId) => {
  if (!accountId) {
    throw new Error('Account ID is required for initialization');
  }
  
  try {
    log(`Initializing account store for account ${accountId}`);
    
    // Set current account
    setCurrentAccount(accountId);
    setVars({ ':acctID': accountId });
    
    // Load account-specific lists in parallel for efficiency
    const promises = [
      execEvent('ingrTypeList', { ':acctID': accountId }).then(data => setIngrTypeList(data)).catch(err => {
        log.warn('Failed to load ingredient types:', err);
        return [];
      }),
      
      execEvent('prodTypeList', { ':acctID': accountId }).then(data => setProdTypeList(data)).catch(err => {
        log.warn('Failed to load product types:', err);
        return [];
      }),
      
      execEvent('vndrList', { ':acctID': accountId }).then(data => setVndrList(data)).catch(err => {
        log.warn('Failed to load vendors:', err);
        return [];
      }),
      
      execEvent('brndList', { ':acctID': accountId }).then(data => setBrndList(data)).catch(err => {
        log.warn('Failed to load brands:', err);
        return [];
      }),
      
      execEvent('wrkrList', { ':acctID': accountId }).then(data => setWrkrList(data)).catch(err => {
        log.warn('Failed to load workers:', err);
        return [];
      })
    ];
    
    // Wait for all promises to complete, even if some fail
    await Promise.allSettled(promises);
    
    log('Account store initialized successfully');
    return true;
  } catch (error) {
    log.error('Failed to initialize account store:', error);
    return false;
  }
};

/**
 * React hook for account management
 * @returns {Object} Account state and methods
 */
export const useAccountStore = () => {
  const { useState, useEffect, useCallback } = require('react');
  
  const [account, setAccount] = useState(currentAccount);
  const [accounts, setAccounts] = useState(accountList);
  const [ingredients, setIngredients] = useState(ingrTypeList);
  const [products, setProducts] = useState(prodTypeList);
  const [vendors, setVendors] = useState(vndrList);
  const [brands, setBrands] = useState(brndList);
  const [workers, setWorkers] = useState(wrkrList);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentAccount !== account) {
        setAccount(currentAccount);
      }
      if (JSON.stringify(accountList) !== JSON.stringify(accounts)) {
        setAccounts([...accountList]);
      }
      if (JSON.stringify(ingrTypeList) !== JSON.stringify(ingredients)) {
        setIngredients([...ingrTypeList]);
      }
      if (JSON.stringify(prodTypeList) !== JSON.stringify(products)) {
        setProducts([...prodTypeList]);
      }
      if (JSON.stringify(vndrList) !== JSON.stringify(vendors)) {
        setVendors([...vndrList]);
      }
      if (JSON.stringify(brndList) !== JSON.stringify(brands)) {
        setBrands([...brndList]);
      }
      if (JSON.stringify(wrkrList) !== JSON.stringify(workers)) {
        setWorkers([...wrkrList]);
      }
    }, 100);
    
    return () => clearInterval(intervalId);
  }, [account, accounts, ingredients, products, vendors, brands, workers]);
  
  const switchAccount = useCallback(async (accountId) => {
    try {
      await initAccountStore(accountId);
      return true;
    } catch (error) {
      log.error('Error switching account:', error);
      return false;
    }
  }, []);
  
  return {
    currentAccount: account,
    accountList: accounts,
    ingrTypeList: ingredients,
    prodTypeList: products,
    vndrList: vendors,
    brndList: brands,
    wrkrList: workers,
    
    // Methods
    setCurrentAccount,
    switchAccount,
    loadUserAccountList,
    
    // Lists setters exposed for components that need to update them
    setIngrTypeList,
    setProdTypeList,
    setVndrList,
    setBrndList,
    setWrkrList
  };
};
