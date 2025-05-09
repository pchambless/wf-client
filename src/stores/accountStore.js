// accountStore.js - Clean MobX implementation with correct naming
import { makeAutoObservable, runInAction } from 'mobx';
import { createContext, useContext } from 'react';
import { execEvent } from './eventStore';
import createLogger from '../utils/logger';
import { APP_SETTINGS } from '../config/settings';
import { triggerAction } from '../actions/actionStore';

const log = createLogger('AccountStore');

// List of reference data types
const LIST_NAMES = [
  'ingrTypeList',
  'prodTypeList',
  'vndrList',
  'brndList',
  'wrkrList',
  'measList'
];

class AccountStore {
  // Authentication state
  currentUser = null;
  token = null;
  isAuthenticated = false;
  
  // Account state
  currentAcctID = '';        // User's current selected account
  userAcctList = [];         // List of accounts user has access to
  pageTitle = APP_SETTINGS.pageTitle;
  
  // Reference data 
  ingrTypeList = [];
  prodTypeList = [];
  vndrList = [];
  brndList = [];
  wrkrList = [];
  measList = [];
  
  // Loading states
  isInitializing = false;
  listLoadingState = {};
  
  constructor() {
    makeAutoObservable(this);
    
    // Initialize from localStorage
    this.token = localStorage.getItem('token');
    this.isAuthenticated = !!this.token;
    this.currentAcctID = localStorage.getItem('currentAcctID') || '';
    
    try {
      const savedList = localStorage.getItem('userAcctList');
      if (savedList) {
        this.userAcctList = JSON.parse(savedList);
      }
    } catch (e) {
      log.error('Failed to parse saved user account list', e);
    }
  }
  
  // Authentication
  setToken(token) {
    this.token = token;
    this.isAuthenticated = !!token;
    
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }
  
  setUser(userData) {
    this.currentUser = userData;
  }
  
  logout() {
    this.currentUser = null;
    this.token = null;
    this.isAuthenticated = false;
    localStorage.removeItem('token');
    
    // Clear account data
    this.clearAcctData();
  }
  
  // Account management
  setCurrentAcctID(acctID) {
    this.currentAcctID = acctID;
    localStorage.setItem('currentAcctID', acctID);
  }
  
  setUserAcctList(list) {  // Changed method name to match convention
    if (!Array.isArray(list)) return;
    
    this.userAcctList = list;
    localStorage.setItem('userAcctList', JSON.stringify(list));
  }
  
  // Page title
  setPageTitle(title = APP_SETTINGS.pageTitle) {
    this.pageTitle = title;
    document.title = title; // Update browser tab title
    return title;
  }
  
  // Reference data management
  async loadList(listName) {
    if (!LIST_NAMES.includes(listName)) {
      log.warn(`Invalid list name: ${listName}`);
      return null;
    }
    
    // Set loading state
    runInAction(() => {
      this.listLoadingState[listName] = true;
    });
    
    try {
      const acctID = this.currentAcctID;
      if (!acctID) {
        log.error(`Cannot load ${listName}, no account ID set`);
        return null;
      }
      
      log.debug(`Loading ${listName}`);
      const items = await execEvent(listName, { acctID });
      
      if (Array.isArray(items)) {
        runInAction(() => {
          this[listName] = items;
        });
        log.debug(`${listName} loaded: ${items.length} items`);
        return items;
      }
      
      log.warn(`Invalid ${listName} response`);
      return null;
    } catch (error) {
      log.error(`Error loading ${listName}:`, error);
      return null;
    } finally {
      runInAction(() => {
        this.listLoadingState[listName] = false;
      });
    }
  }
  
  async ensureListLoaded(listName) {
    if (!LIST_NAMES.includes(listName)) {
      log.warn(`Invalid list name: ${listName}`);
      return false;
    }
    
    // If list is already loaded, return true
    if (this[listName].length > 0) {
      return true;
    }
    
    // If list is already loading, don't load again
    if (this.listLoadingState[listName]) {
      return false;
    }
    
    // Load the list
    const result = await this.loadList(listName);
    return Array.isArray(result) && result.length > 0;
  }
  
  // Clear all account data
  clearAcctData() {
    LIST_NAMES.forEach(name => {
      this[name] = [];
    });
  }
  
  // Initialize all account data
  async initializeAcctData(forceReload = false) {
    if (this.isInitializing && !forceReload) {
      log.warn('Account store initialization already in progress');
      return false;
    }
    
    runInAction(() => {
      this.isInitializing = true;
    });
    
    try {
      const acctID = this.currentAcctID;
      log.info('Initializing account store', { acctID });
      
      if (!acctID) {
        log.error('No account ID found, cannot initialize');
        return false;
      }
      
      // Clear existing data
      this.clearAcctData();
      
      // Load all lists in parallel
      const loadPromises = LIST_NAMES.map(name => this.loadList(name));
      const results = await Promise.all(loadPromises);
      
      const success = results.every(Boolean);
      
      // Signal completion
      triggerAction('ACCOUNT_INITIALIZED', { acctID });
      
      log.info(`Account data initialization ${success ? 'completed' : 'failed'}`);
      return success;
    } catch (error) {
      log.error('Failed to initialize account store:', error);
      return false;
    } finally {
      runInAction(() => {
        this.isInitializing = false;
      });
    }
  }
  
  // Switch accounts with all required actions
  async switchAcct(acctID, navigate) {
    try {
      log.info(`Switching to account: ${acctID}`);
      
      // Set current account
      this.setCurrentAcctID(acctID);
      
      // Reset page title
      this.setPageTitle();
      
      // Reload account data
      await this.initializeAcctData(true);
      
      // Navigate if provided
      if (navigate && typeof navigate === 'function') {
        navigate('/welcome');
      }
      
      return true;
    } catch (error) {
      log.error('Error switching accounts:', error);
      return false;
    }
  }
  
  // Reference data access helper
  getRefDataByName(listName) {
    if (!LIST_NAMES.includes(listName)) {
      log.warn(`Invalid list name: ${listName}`);
      return [];
    }
    return this[listName] || [];
  }
}

// Create singleton instance
const accountStore = new AccountStore();

// Create React context
const AccountContext = createContext(accountStore);

// Create hook for components to use
export const useAccountStore = () => useContext(AccountContext);

// Export the store instance directly
export default accountStore;

// Export context for provider setup
export { AccountContext };
