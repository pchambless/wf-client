import createLogger from '../utils/logger';
import { getVar, setVars } from '../utils/externalStore';

const log = createLogger('PageStore');

// State variables
let currentPageName = null;
let pageTitle = 'WhatsFresh';
let pageMetadata = {}; // For storing additional page metadata
let _tabConfigData = []; // Renamed to avoid conflict
let activeTabIndex = 0;
let selectedTabItems = {};

// Initial breadcrumbs state should be an array with at least Home
const initialBreadcrumbs = [{ label: 'Home', path: '/' }];
setVars({ ':page.breadcrumbs': initialBreadcrumbs });

/**
 * Set current page name and update page title automatically
 * @param {string} pageName - Name of the current page
 * @param {Object} options - Additional options
 * @param {string} options.title - Optional custom title override
 * @param {Array} options.breadcrumbs - Optional breadcrumbs array
 * @param {Object} options.metadata - Optional page metadata
 * @param {Array} options.tabConfig - Optional tab configuration
 */
export const setCurrentPage = (pageName, options = {}) => {
  // Set the current page name
  currentPageName = pageName;
  
  // Set page title - use provided title or generate from page name
  const newTitle = options.title || 
    (pageName ? `${pageName.charAt(0).toUpperCase()}${pageName.slice(1)}` : 'WhatsFresh');
  setPageTitle(newTitle);
  
  // Update breadcrumbs if provided, otherwise create default
  if (options.breadcrumbs) {
    setBreadcrumbs(options.breadcrumbs);
  } else if (pageName) {
    // Create default breadcrumb for current page
    const defaultBreadcrumbs = [
      { label: 'Home', path: '/' },
      { label: newTitle, path: `/${pageName.toLowerCase()}` }
    ];
    setBreadcrumbs(defaultBreadcrumbs);
  }
  
  // Update metadata if provided
  if (options.metadata) {
    pageMetadata = { ...pageMetadata, ...options.metadata };
  }
  
  // Set tab configuration if provided
  if (options.tabConfig) {
    settabConfig(options.tabConfig);
  }
  
  log(`Current page set to: ${pageName}`);
};

/**
 * Get current page name
 * @returns {string} Current page name
 */
export const getCurrentPage = () => currentPageName;

/**
 * Set page title
 * @param {string} title - Page title
 */
export const setPageTitle = (title) => {
  const newTitle = title || 'What\'s Fresh';
  setVars({ ':pageTitle': newTitle });
  document.title = `WhatsFresh - ${newTitle}`;
  log.info(`Page title set: ${newTitle}`);
};

/**
 * Get page title
 * @returns {string} Current page title
 */
export const getPageTitle = () => pageTitle;

/**
 * Set breadcrumbs for current page
 * @param {Array} crumbs - Array of breadcrumb objects { label, path }
 */
export const setBreadcrumbs = (crumbs) => {
  // Ensure we always have an array
  const safeValue = Array.isArray(crumbs) ? crumbs : initialBreadcrumbs;
  log('Setting breadcrumbs:', safeValue);
  setVars({ ':page.breadcrumbs': safeValue });
};

/**
 * Get breadcrumbs
 * @returns {Array} Current breadcrumbs
 */
export const getBreadcrumbs = () => {
  const crumbs = getVar(':page.breadcrumbs');
  // Default to initial breadcrumbs if none set
  return Array.isArray(crumbs) ? crumbs : initialBreadcrumbs;
};

/**
 * Set page metadata
 * @param {Object} metadata - Page metadata
 */
export const setPageMetadata = (metadata) => {
  pageMetadata = { ...pageMetadata, ...metadata };
  log('Page metadata updated');
};

/**
 * Get page metadata
 * @returns {Object} Current page metadata
 */
export const getPageMetadata = () => ({ ...pageMetadata });

/**
 * Set tab configuration
 * @param {Array} newTabConfig - Array of tab configuration objects
 */
export const settabConfig = (newTabConfig) => {
  _tabConfigData = [...newTabConfig]; // Use renamed variable
  log('Tab configuration updated', _tabConfigData);
};

/**
 * Get tab configuration
 * @returns {Array} Current tab configuration
 */
export const gettabConfig = () => [..._tabConfigData]; // Use renamed variable

/**
 * Set active tab index
 * @param {number} index - Tab index to activate
 */
export const setActiveTabIndex = (index) => {
  activeTabIndex = index;
  log(`Active tab index set to: ${index}`);
};

/**
 * Get active tab index
 * @returns {number} Active tab index
 */
export const getActiveTabIndex = () => activeTabIndex;

/**
 * Set selected item for a tab
 * @param {number} tabLevel - Tab level
 * @param {Object} item - Selected item
 * @param {boolean} updateBreadcrumbs - Whether to update breadcrumbs
 */
export const setSelectedTabItem = (tabLevel, item, updateBreadcrumbs = true) => {
  if (!item) {
    selectedTabItems[tabLevel] = null;
    return;
  }
  
  selectedTabItems[tabLevel] = { ...item };
  log(`Selected item for tab level ${tabLevel} updated`, item);
  
  // Update breadcrumbs based on selected tab items
  if (updateBreadcrumbs && _tabConfigData.length > 0) {
    const newBreadcrumbs = [{
      label: 'Home',
      path: '/'
    }];
    
    // Add current page as the base breadcrumb
    newBreadcrumbs.push({
      label: pageTitle,
      path: `/${currentPageName.toLowerCase()}`
    });
    
    // Add breadcrumbs for each selected tab item
    Object.keys(selectedTabItems)
      .filter(level => selectedTabItems[level] !== null)
      .sort((a, b) => Number(a) - Number(b))
      .forEach(level => {
        const item = selectedTabItems[level];
        const tabConfig = _tabConfigData[level];
        if (item && tabConfig) {
          // Try to get a suitable display name from the item
          const displayField = tabConfig.displayField || 'name';
          const displayName = item[displayField] || `Item ${item.id || ''}`;
          
          newBreadcrumbs.push({
            label: `${tabConfig.tabTitle}: ${displayName}`,
            path: `/${currentPageName.toLowerCase()}/${tabConfig.pageName.toLowerCase()}/${item.id}`
          });
        }
      });
    
    setBreadcrumbs(newBreadcrumbs);
  }
};

/**
 * Get selected item for a tab
 * @param {number} tabLevel - Tab level
 * @returns {Object|null} Selected item
 */
export const getSelectedTabItem = (tabLevel) => {
  return selectedTabItems[tabLevel] ? { ...selectedTabItems[tabLevel] } : null;
};

/**
 * Clear all selected tab items
 */
export const clearSelectedTabItems = () => {
  selectedTabItems = {};
  log('All selected tab items cleared');
};

/**
 * Handle tab row selection
 * @param {number} level - Tab level
 * @param {Object} rowData - Selected row data
 * @param {boolean} activateNextTab - Whether to activate the next tab
 */
export const handleTabRowSelection = (level, rowData, activateNextTab = true) => {
  // Store selected row data
  setSelectedTabItem(level, rowData);
  
  // Activate next tab if specified
  if (activateNextTab && rowData && level < _tabConfigData.length - 1) {
    setActiveTabIndex(level + 1);
  }
  
  log(`Tab row selection handled for level ${level}`, rowData);
};

/**
 * React hook for page management
 * @returns {Object} Page state and methods
 */
export const usePageStore = () => {
  const { useState, useEffect, useCallback } = require('react');
  
  const [page, setPage] = useState(currentPageName);
  const [title, setTitle] = useState(pageTitle);
  const [crumbs, setCrumbs] = useState(getBreadcrumbs());
  const [metadata, setMetadata] = useState(pageMetadata);
  const [tabConfigState, setTabConfigState] = useState(_tabConfigData); // Renamed variable
  const [activeTab, setActiveTab] = useState(activeTabIndex);
  const [selectedItems, setSelectedItems] = useState(selectedTabItems);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (currentPageName !== page) {
        setPage(currentPageName);
      }
      if (pageTitle !== title) {
        setTitle(pageTitle);
      }
      const currentBreadcrumbs = getBreadcrumbs();
      if (JSON.stringify(currentBreadcrumbs) !== JSON.stringify(crumbs)) {
        setCrumbs([...currentBreadcrumbs]);
      }
      if (JSON.stringify(pageMetadata) !== JSON.stringify(metadata)) {
        setMetadata({ ...pageMetadata });
      }
      if (JSON.stringify(_tabConfigData) !== JSON.stringify(tabConfigState)) {
        setTabConfigState([..._tabConfigData]);
      }
      if (activeTabIndex !== activeTab) {
        setActiveTab(activeTabIndex);
      }
      if (JSON.stringify(selectedTabItems) !== JSON.stringify(selectedItems)) {
        setSelectedItems({...selectedTabItems});
      }
    }, 100);
    
    return () => clearInterval(intervalId);
  }, [page, title, crumbs, metadata, tabConfigState, activeTab, selectedItems]);
  
  const handleRowSelection = useCallback((level, rowData, activateNextTab = true) => {
    handleTabRowSelection(level, rowData, activateNextTab);
  }, []);
  
  return {
    currentPage: page,
    pageTitle: title,
    breadcrumbs: crumbs,
    metadata: metadata,
    tabConfig: tabConfigState, // Use the state variable
    activeTabIndex: activeTab,
    selectedTabItems: selectedItems,
    
    // Methods
    setCurrentPage: (pageName, options) => setCurrentPage(pageName, options),
    setPageTitle: (newTitle) => setPageTitle(newTitle),
    setBreadcrumbs: (newCrumbs) => setBreadcrumbs(newCrumbs),
    setPageMetadata: (newMetadata) => setPageMetadata(newMetadata),
    settabConfig: (newConfig) => settabConfig(newConfig),
    setActiveTabIndex: (index) => setActiveTabIndex(index),
    setSelectedTabItem: (level, item) => setSelectedTabItem(level, item),
    handleRowSelection,
    clearSelectedTabItems: () => clearSelectedTabItems()
  };
};

// Initialize with default values
export const initPageStore = () => {
  log.info('Initializing page store');
  setPageTitle('Welcome');
  return true;
};
