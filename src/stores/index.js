// Central barrel file for exporting all store functions
// Import modalStore from new location
import { modalStore } from '@modal';

// From eventStore
export {
  execEvent,
  getEventTypeConfig,
  initEventTypeService,
  isEventTypeServiceInitialized
} from './eventStore';


// From accountStore (much simpler!)
export {
  default as accountStore,
  useAccountStore,
  AccountContext
} from './accountStore';



// Export modalStore directly without trying to access non-existent methods
export { 
  modalStore,
};

// From pageStore
export {
  setCurrentPage,
  getCurrentPage,
  setPageTitle,
  getPageTitle,
  setBreadcrumbs,
  getBreadcrumbs,
  settabConfig,
  gettabConfig,
  setActiveTabIndex,
  getActiveTabIndex,
  setSelectedTabItem,
  getSelectedTabItem,
  clearSelectedTabItems,
  handleTabRowSelection,
  usePageStore,
  initPageStore
} from './pageStore';

