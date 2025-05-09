import { makeAutoObservable } from 'mobx';

class NavigationStore {
  // Current navigation
  currentPath = '';
  currentPage = '';
  pageTitle = '';
  
  // Breadcrumbs state
  breadcrumbs = [];
  
  // Tabs state from pageStore
  tabConfig = null;
  activeTabIndex = 0;
  selectedTabItems = {};
  
  constructor() {
    makeAutoObservable(this);
  }
  
  // Navigation methods
  setCurrentPage(page, path) {
    this.currentPage = page;
    this.currentPath = path;
  }
  
  // Breadcrumb methods
  setBreadcrumbs(breadcrumbs) {
    this.breadcrumbs = breadcrumbs;
  }
  
  addBreadcrumb(crumb) {
    this.breadcrumbs.push(crumb);
  }
  
  // Tab methods
  setTabConfig(config) {
    this.tabConfig = config;
  }
  
  setActiveTabIndex(index) {
    this.activeTabIndex = index;
  }
  
  setSelectedTabItem(tabId, item) {
    this.selectedTabItems[tabId] = item;
  }
  
  clearSelectedTabItems() {
    this.selectedTabItems = {};
  }
}

export const navigationStore = new NavigationStore();
