import createLogger from '../../utils/logger';
import accountStore from '../../stores/accountStore';
import navigationStore from '../../stores/navigationStore';
import { 
  execEvent,
  initEventTypeService
} from '../../stores';

export class LoginPresenter {
  constructor() {
    this.log = createLogger('Login');
  }

  async initEventTypes() {
    try {
      this.log.info('Initializing event types');
      const success = await initEventTypeService();
      
      if (!success) {
        throw new Error('Failed to initialize event types');
      }
      
      this.log.info('Event types initialized successfully');
      return true;
    } catch (error) {
      this.log.error('Error initializing event types:', error);
      throw error;
    }
  }

  async initApplicationState(user, accounts) {
    try {
      // Set up navigation first
      navigationStore.setPageTitle("WhatsFresh");
      
      // Update account store with user data - this replaces setVars
      accountStore.setUserData(user);
      accountStore.setUserAcctList(accounts);
      
      // Load reference data
      await this.loadReferenceData();
      
      return true;
    } catch (error) {
      this.log.error('Error initializing application state:', error);
      throw error;
    }
  }
  
  async loadReferenceData() {
    try {
      if (!accountStore.currentAcctID) {
        throw new Error('No account ID available for loading reference data');
      }
      
      // Load account-specific reference data
      const acctID = accountStore.currentAcctID;
      
      const [
        ingrTypes, 
        prodTypes,
        measures,
        brands,
        vendors,
        workers
      ] = await Promise.all([
        execEvent('ingrTypeList', { ':acctID': acctID }),
        execEvent('prodTypeList', { ':acctID': acctID }),
        execEvent('measList'),
        execEvent('brndList', { ':acctID': acctID }),
        execEvent('vndrList', { ':acctID': acctID }),
        execEvent('wrkrList', { ':acctID': acctID })
      ]);
      
      // Update store with results
      accountStore.setIngrTypeList(ingrTypes);
      accountStore.setProdTypeList(prodTypes);
      accountStore.setMeasList(measures);
      accountStore.setBrndList(brands);
      accountStore.setVndrList(vendors);
      accountStore.setWrkrList(workers);
      
      this.log.info('Reference data loaded successfully');
      return true;
    } catch (error) {
      this.log.error('Failed to load reference data', error);
      throw error;
    }
  }

  async handleLogin(credentials) {
    this.log.info('Login attempt started');
    try {
      this.log.info('Sending login request...');
      
      // Using direct params for credential passing
      const result = await execEvent('userLogin', {
        ':userEmail': credentials.email,
        ':enteredPassword': credentials.password
      });
      
      this.log.info('Login response received');
      
      // Extract user data from the result
      let userData;
      if (Array.isArray(result) && result.length > 0) {
        userData = result[0];
      } else if (result && typeof result === 'object') {
        userData = result;
      } else {
        throw new Error('Invalid login response format');
      }
      
      // Load accounts
      const accounts = await execEvent('userAcctList', { 
        ':userID': userData.userID 
      });
      
      // Initialize the application state
      await this.initApplicationState(userData, accounts);
      
      return result;
    } catch (error) {
      this.log.error('Login failed:', error);
      throw error;
    }
  }
}
