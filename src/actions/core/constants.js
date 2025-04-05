/**
 * Standard application actions
 * 
 * Organized by functional categories for clearer imports and usage
 */

// Correctly export action types for consistent imports
// Navigation actions
export const NAVIGATION = {
  TAB_SELECT: 'tabSelect',
  PAGE_SELECT: 'pageSelect',
  MODAL_OPEN: 'modalOpen',
  MODAL_CLOSE: 'modalClose',
};

// Data selection actions
export const SELECTION = {
  ROW_SELECT: 'rowSelect',
  ITEM_SELECT: 'itemSelect',
  FILTER_APPLY: 'filterApply',
  SORT_CHANGE: 'sortChange',
};

// Form actions
export const FORM = {
  FIELD_CHANGED: 'formFieldChanged',
  SUBMITTED: 'formSubmitted',
  VALIDATED: 'formValidated',
  MODE_CHANGED: 'formModeChanged',
  REFRESHED: 'formRefreshed',
};

// CRUD operations
export const CRUD = {
  ITEM_CREATE: 'itemCreate',
  ITEM_UPDATE: 'itemUpdate',
  ITEM_DELETE: 'itemDelete',
  LIST_REFRESH: 'listRefresh'
};

// UI state actions
export const UI = {
  STATE_CHANGE: 'stateChange',
  LOADING_START: 'loadingStart',
  LOADING_FINISH: 'loadingFinish',
  ERROR_OCCUR: 'errorOccur'
};

// Combined export for convenience
export const ACTIONS = {
  NAVIGATION,
  SELECTION,
  FORM,
  CRUD,
  UI
};
