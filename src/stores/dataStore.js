// src/stores/dataStore.js
import { makeAutoObservable, runInAction } from 'mobx';
import createLogger from '@utils/logger';
import { execEvent } from '@stores/eventStore';
import accountStore from '@stores/accountStore';
// Add this import
import { verifyPageMap } from '@utils/debugPageMap';

/**
 * DataStore Class - handles all data operations for CRUD interfaces
 */
class DataStore {
  // Core state
  tableData = [];
  selectedRow = null;
  formMode = 'SELECT'; // Using SQL modes consistently
  isLoading = false;
  error = null;
  
  // Config state
  currentPageMap = null;
  
  constructor() {
  // Create logger first
  this.log = createLogger('DataStore');
  
  // Make specific properties non-observable
  makeAutoObservable(this, {
    // Exclude currentPageMap from reactivity system
    currentPageMap: false 
  });
}

/**
 * Set current page configuration (enhanced version)
 */
setPageMap(pageMap) {
  // Verify pageMap integrity BEFORE setting
  verifyPageMap(pageMap, 'DataStore.setPageMap.before');
  
  // Check if the pageMap structure looks valid before assigning
  if (pageMap && Array.isArray(pageMap.columnMap)) {
    // Fix: Use correct logger syntax
    this.log('Setting pageMap with columns:', 
      pageMap.columnMap.map(col => `${col.field}:${col.dbColumn || '?'}`).join(', ')
    );
  }
  
  // Store the page map by reference - do NOT make a copy
  this.currentPageMap = pageMap;
  
  // Verify pageMap integrity AFTER setting
  verifyPageMap(this.currentPageMap, 'DataStore.setPageMap.after');
}
  
  /**
   * The SINGLE source of truth for data fetching
   */
  async fetchData(listEvent, pageMap = this.currentPageMap) {
    if (!listEvent) {
      // Change this
      this.log('No listEvent provided', 'warn');
      return [];
    }
    
    // Change this
    this.log(`Fetching data using ${listEvent}`);
    this.isLoading = true;
    this.error = null;
    
    try {
      // Get parameters from pageMap configuration
      const params = this.buildListParameters(pageMap);
      
      // Change this
      this.log('Executing list event with params:', params);
      
      // Execute the event to get data
      const result = await execEvent(listEvent, params);
      
      // Update state with the fetched data
      runInAction(() => {
        this.tableData = Array.isArray(result) ? result : [];
        this.isLoading = false;
      });
      
      // Change this
      this.log(`Fetched ${this.tableData.length} records`);
      return this.tableData;
    } catch (error) {
      runInAction(() => {
        this.error = error.message || 'Failed to fetch data';
        this.isLoading = false;
        this.tableData = [];
      });
      
      // Change this
      this.log('Error fetching data:', error);
      return [];
    }
  }
  
  /**
   * Build parameters for list query based on pageMap configuration
   */
  buildListParameters(pageMap) {
    if (!pageMap) return {};
    
    const { pageConfig } = pageMap;
    const params = {};
    
    // Add any default parameters from pageConfig
    if (pageConfig?.defaultParams) {
      Object.assign(params, pageConfig.defaultParams);
    }
    
    // Handle parent-child relationship if specified
    if (pageConfig?.parentIDField) {
      const parentField = pageConfig.parentIDField;
      
      // Get value from current selections in accountStore
      const parentValue = accountStore.getSelectedEntity(parentField);
      
      if (parentValue) {
        params[parentField] = parentValue;
        this.log('Added parent filter:', { field: parentField, value: parentValue });  
      } else {
        this.log('Parent field has no selected value:', { field: parentField });
      }
    }
    
    return params;
  }
  
  /**
   * Refresh data using current configuration
   */
  async refreshData() {
    if (!this.currentPageMap?.pageConfig?.listEvent) {
      this.log('Cannot refresh data: no listEvent configured');
      return [];
    }
    
    return this.fetchData(
      this.currentPageMap.pageConfig.listEvent,
      this.currentPageMap
    );
  }
  
  /**
   * Select a row for editing/viewing
   */
  selectRow(row) {
    this.log('Selected row:', row);
    this.selectedRow = row;
    
    // Also update the form mode to indicate editing
    if (row) {
      this.formMode = 'UPDATE';
    } else {
      this.formMode = 'SELECT';
    }
  }
  
  /**
   * Clear the selected row
   */
  clearSelectedRow() {
    this.selectedRow = null;
    this.formMode = 'SELECT';
  }
  
  /**
   * Prepare for adding a new record
   */
  clearFormFields() {
    this.selectedRow = null;
    this.formMode = 'INSERT';
  }
  
  /**
   * Set the form mode
   */
  setFormMode(mode) {
    // Normalize to uppercase for consistency
    const normalizedMode = mode.toUpperCase();
    
    // Validate it's a proper SQL operation mode
    if (['SELECT', 'INSERT', 'UPDATE', 'DELETE'].includes(normalizedMode)) {
      this.formMode = normalizedMode;
      this.log(`Form mode set to: ${this.formMode}`);
    } else {
      this.log(`Invalid form mode: ${mode}, defaulting to SELECT`);
      this.formMode = 'SELECT';
    }
  }
  
  /**
   * Standard save method for any entity
   * @param {Object} formData - The data to save
   * @param {String} mode - SQL mode (INSERT, UPDATE, DELETE)
   * @returns {Promise} - Result of the save operation
   */
  async saveData(formData, mode = this.formMode) {
    if (!this.currentPageMap) {
      this.log('Cannot save: No page configuration');
      throw new Error('Missing page configuration');
    }
    
    const { pageConfig } = this.currentPageMap;
    const entityType = pageConfig?.entityType;
    
    if (!entityType) {
      this.log('Cannot save: No entityType in pageConfig'); // Changed from this.log.error
      throw new Error('Missing entityType configuration');
    }
    
    this.log(`Saving ${entityType} data in ${mode} mode`); // Changed from this.log.info
    
    try {
      // Construct a standard save event name following convention
      const saveEvent = pageConfig?.saveEvent || `${entityType}Save`;
      
      // Prepare save parameters
      const params = {
        mode, // SQL mode (INSERT, UPDATE, DELETE)
        entityType,
        data: formData,
        ...this.buildParentParameters(pageConfig)
      };
      
      this.log('Executing save with params:', params); // Changed from this.log.debug
      
      // Execute the save event
      const result = await execEvent(saveEvent, params);
      
      // Refresh table data after save
      await this.refreshData();
      
      return result;
    } catch (error) {
      this.log('Error saving data:', error); // Changed from this.log.error
      throw error;
    }
  }
  
  /**
   * Extract parent parameters for child entities
   */
  buildParentParameters(pageConfig) {
    const params = {};
    
    // Handle parent-child relationship if specified
    if (pageConfig?.parentIDField) {
      const parentField = pageConfig.parentIDField;
      const parentValue = accountStore.getSelectedEntity(parentField);
      
      if (parentValue) {
        params[parentField] = parentValue;
      }
    }
    
    return params;
  }
  
  /**
   * Set the parent ID for filtering child entities
   */
  setParentId(id) {
    this.parentId = id;
    // Store in session/local storage for persistence across page refreshes
    sessionStorage.setItem('currentParentId', id);
  }

  /**
   * Get the current parent ID
   */
  getParentId() {
    // Retrieve from state or session storage if available
    return this.parentId || sessionStorage.getItem('currentParentId');
  }
}

// Create singleton instance
const dataStore = new DataStore();
export default dataStore;
