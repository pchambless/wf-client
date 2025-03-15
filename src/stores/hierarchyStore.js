// src/stores/hierarchyStore.js
import createLogger from '../utils/logger';
import { getVar } from '../utils/externalStore'; // Remove setVars if not used
import { setBreadcrumbs, setTabConfiguration } from './pageStore';

const log = createLogger('HierarchyStore');

// Page hierarchy configuration
const pageHierarchy = {
  Ingredient: {
    pageName: 'Ingredient',
    path: '/ingredients',
    label: 'Ingredients',
    hierarchy: [
      {
        pageName: 'IngrTypes',     // Match pageConfig.pageName
        listEvent: 'ingrTypeList', // Match pageConfig.listEvent
        keyField: 'ingrTypeID',    // Primary key (same as idField)
        label: 'Ingredient Types',
        displayField: 'ingrTypeName',
        varName: ':ingrTypeName',
        pathSuffix: '/type'        // Used for URL routing if needed
      },
      {
        pageName: 'Ingredients',
        listEvent: 'ingrList',
        keyField: 'ingrID',
        label: 'Ingredients',
        displayField: 'ingrName',
        varName: ':ingrName',
        pathSuffix: '/ingredient',
        parent: 'ingrTypeList'
      },
      {
        pageName: 'IngrBatches',
        listEvent: 'ingrBtchList',
        keyField: 'ingrBtchID',
        label: 'Ingredient Batches',
        displayField: 'ingrBtchID', 
        varName: ':ingrBtchID',
        pathSuffix: '/batch',
        parent: 'ingrList'
      }
    ]
  },
  Product: {
    pageName: 'Product',
    path: '/products',
    label: 'Products',
    hierarchy: [
      {
        pageName: 'ProdTypes',
        listEvent: 'prodTypeList',
        keyField: 'prodTypeID',
        label: 'Product Types',
        displayField: 'prodTypeName',
        varName: ':prodTypeName',
        pathSuffix: '/type'
      },
      {
        pageName: 'Products',
        listEvent: 'prodList',
        keyField: 'prodID',
        label: 'Products',
        displayField: 'prodName',
        varName: ':prodName',
        pathSuffix: '/product',
        parent: 'prodTypeList'
      },
      {
        pageName: 'ProdBatches',
        listEvent: 'prodBtchList',
        keyField: 'prodBtchID',
        label: 'Product Batches',
        displayField: 'prodBtchID',
        varName: ':prodBtchID',
        pathSuffix: '/batch',
        parent: 'prodList'
      }
    ]
  },
  Account: {
    pageName: 'Account',
    path: '/accounts',
    label: 'Accounts',
    // Non-hierarchical tabs
    tabs: [
      {
        pageName: 'Vendors',
        listEvent: 'vndrList',
        keyField: 'vndrID',
        label: 'Vendors',
        displayField: 'vndrName'
      },
      {
        pageName: 'Brands',
        listEvent: 'brndList',
        keyField: 'brndID',
        label: 'Brands',
        displayField: 'brndName'
      },
      {
        pageName: 'Workers',
        listEvent: 'wrkrList',
        keyField: 'wrkrID',
        label: 'Workers',
        displayField: 'wrkrName'
      }
    ]
  },
  Admin: {
    pageName: 'Admin',
    path: '/admin',
    label: 'Administration',
    // Non-hierarchical tabs
    tabs: [
      {
        pageName: 'Accounts',
        listEvent: 'acctList',
        keyField: 'acctID',
        label: 'Accounts',
        displayField: 'acctName'
      },
      {
        pageName: 'Users',
        listEvent: 'userList',
        keyField: 'userID',
        label: 'Users',
        displayField: 'userName'
      },
      {
        pageName: 'MeasUnits',
        listEvent: 'measList',
        keyField: 'measID',
        label: 'Measurements',
        displayField: 'measName'
      },
      {
        pageName: 'wfPages',
        listEvent: 'pageList',
        keyField: 'pageID',
        label: 'Pages',
        displayField: 'pageName'
      }
    ]
  }
};

/**
 * Get the hierarchy configuration for a specific page
 * @param {string} pageName - Name of the page
 * @returns {Object|null} Page hierarchy configuration
 */
export const getPageHierarchy = (pageName) => {
  return pageHierarchy[pageName] || null;
};

/**
 * Generate tab configuration from page hierarchy
 * @param {string} pageName - Name of the page
 * @returns {Array} Tab configuration objects
 */
export const generateTabConfig = (pageName) => {
  const pageConfig = getPageHierarchy(pageName);
  if (!pageConfig) return [];
  
  // For hierarchical pages
  if (pageConfig.hierarchy) {
    return pageConfig.hierarchy.map((level, index) => ({
      tabTitle: level.label,
      pageName: level.pageName,       // Use the pageName that matches pageConfigs
      listEvent: level.listEvent,     // Renamed from selList
      keyField: level.keyField,       // Keep keyField for DML operations
      displayField: level.displayField,
      parentLevel: index > 0 ? index - 1 : null,
      index
    }));
  }
  
  // For non-hierarchical pages
  if (pageConfig.tabs) {
    return pageConfig.tabs.map((tab, index) => ({
      tabTitle: tab.label,
      pageName: tab.pageName,        // Use the pageName that matches pageConfigs
      listEvent: tab.listEvent,      // Renamed from selList
      keyField: tab.keyField,        // Keep keyField for DML operations
      displayField: tab.displayField,
      index
    }));
  }
  
  return [];
};

/**
 * Initialize a page with its hierarchy configuration
 * @param {string} pageName - Name of the page
 * @returns {boolean} Success status
 */
export const initPageWithHierarchy = (pageName) => {
  const pageConfig = getPageHierarchy(pageName);
  if (!pageConfig) {
    log.warn(`No page configuration found for page: ${pageName}`);
    return false;
  }
  
  // Generate tab configuration from hierarchy
  const tabConfig = generateTabConfig(pageName);
  setTabConfiguration(tabConfig);
  
  // Set initial breadcrumbs
  const initialBreadcrumbs = [
    { label: 'Home', path: '/' },
    { label: pageConfig.label, path: pageConfig.path }
  ];
  setBreadcrumbs(initialBreadcrumbs);
  
  log(`Page ${pageName} initialized with hierarchy configuration`);
  return true;
};

/**
 * Update breadcrumbs based on page hierarchy and selected items
 * @param {string} pageName - Name of the page
 * @param {Array} selectedItems - Array of selected items (can be objects or booleans)
 * @param {number} activeTabIndex - Index of the active tab
 */
export const updateBreadcrumbsFromHierarchy = (pageName, selectedItems = [], activeTabIndex = 0) => {
  const pageConfig = getPageHierarchy(pageName);
  if (!pageConfig) {
    log('No page configuration found for page:', pageName);
    return;
  }
  
  // Start with just one Home and the main page
  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: pageConfig.label, path: pageConfig.path }
  ];
  
  // For hierarchical pages, add hierarchy levels
  if (pageConfig.hierarchy) {
    for (let index = 0; index <= activeTabIndex; index++) {
      // Skip if nothing selected at this level or beyond the active tab
      if (index > 0 && !selectedItems[index - 1]) {
        break; // Stop adding breadcrumbs if we have a gap in selection
      }
      
      const level = pageConfig.hierarchy[index];
      if (!level) continue;
      
      // For the first level (index 0), we already have the main page breadcrumb
      if (index === 0) continue;
      
      // Get the variable value for this level
      const varValue = getVar(level.varName);
      if (!varValue) continue;
      
      // Add this level to breadcrumbs with proper label
      breadcrumbs.push({
        label: `${varValue}`,
        path: `${pageConfig.path}${level.pathSuffix}`
      });
    }
  } 
  // For non-hierarchical pages, just add the active tab
  else if (pageConfig.tabs && activeTabIndex < pageConfig.tabs.length) {
    const activeTab = pageConfig.tabs[activeTabIndex];
    breadcrumbs.push({
      label: activeTab.label,
      path: `${pageConfig.path}/${activeTab.pageName.toLowerCase()}`
    });
  }
  
  log(`Updated breadcrumbs for ${pageName}:`, breadcrumbs);
  setBreadcrumbs(breadcrumbs);
};

/**
 * Find a hierarchy level by listEvent
 * @param {string} pageName - Main page name
 * @param {string} listEvent - The listEvent to find
 * @returns {Object|null} Hierarchy level configuration
 */
export const findHierarchyLevel = (pageName, listEvent) => {
  const pageConfig = getPageHierarchy(pageName);
  if (!pageConfig) return null;
  
  if (pageConfig.hierarchy) {
    return pageConfig.hierarchy.find(
      level => level.listEvent === listEvent
    );
  }
  
  if (pageConfig.tabs) {
    return pageConfig.tabs.find(
      tab => tab.listEvent === listEvent
    );
  }
  
  return null;
};

/**
 * Get KeyField for a specific listEvent
 * @param {string} pageName - Main page name
 * @param {string} listEvent - The listEvent to find the keyField for
 * @returns {string|null} The keyField for the listEvent or null if not found
 */
export const getKeyFieldForSelList = (pageName, listEvent) => {
  const levelConfig = findHierarchyLevel(pageName, listEvent);
  return levelConfig ? levelConfig.keyField : null;
};

/**
 * Initialize the hierarchy store
 * @returns {boolean} Success status
 */
export const initHierarchyStore = () => {
  log('Initializing hierarchy store');
  return true;
};

// Hook for using hierarchy store in React components
export const useHierarchyStore = () => {
  // Remove useState and useEffect if not used
  return {
    getPageHierarchy,
    generateTabConfig,
    initPageWithHierarchy,
    updateBreadcrumbsFromHierarchy,
    findHierarchyLevel,
    getKeyFieldForSelList
  };
};

// Fix the anonymous export warning
const hierarchyStoreExports = {
  getPageHierarchy,
  generateTabConfig,
  initPageWithHierarchy,
  updateBreadcrumbsFromHierarchy,
  findHierarchyLevel,
  getKeyFieldForSelList,
  initHierarchyStore,
  useHierarchyStore
};

export default hierarchyStoreExports;
