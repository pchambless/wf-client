import { setVars } from '../../utils/externalStore';
import { triggerAction } from '../actionStore';
import { SELECTION } from '../core/constants';
import { initAccountStore } from '../../stores/accountStore';
import createLogger from '../../utils/logger';

const log = createLogger('ActionHandlers.Selection');

/**
 * Selection action handlers
 */
const selectionHandlers = {
  ITEM_SELECT: {
    // Account selection handler
    acctSelect: {
      description: "Handle account selection from the header dropdown",
      payload: {
        item: "Selected account object",
        itemType: "account",
        itemId: "Account ID",
        source: "accountSelector"
      },
      handlers: [
        {
          name: "Update current account",
          code: `setVars({ ':acctID': payload.item.id })`,
          implementation: (payload) => {
            log.info('Setting current account:', payload.item.id);
            setVars({ ':acctID': payload.item.id });
          }
        },
        {
          name: "Initialize account store with new account",
          code: `initAccountStore()`,
          implementation: async () => {
            log.info('Reinitializing account store');
            await initAccountStore();
          }
        },
        {
          name: "Navigate to welcome page if needed",
          code: `if (payload.navigate) payload.navigate('/welcome')`,
          implementation: (payload) => {
            if (payload.navigate) {
              log.info('Navigating to welcome page');
              payload.navigate('/welcome');
            }
          }
        }
      ]
    },
    
    // Filter selection handler
    filterSelect: {
      description: "Handle filter option selection",
      payload: {
        item: "Selected filter option",
        itemType: "filter",
        filterId: "ID of the filter",
        source: "filterPanel"
      },
      handlers: [
        {
          name: "Apply filter to current list",
          code: `triggerAction(SELECTION.FILTER_APPLY, { 
            filter: payload.item, 
            listId: payload.listId 
          })`,
          implementation: (payload) => {
            log.info('Applying filter:', payload.item);
            triggerAction(SELECTION.FILTER_APPLY, {
              filter: payload.item,
              listId: payload.listId
            });
          }
        }
      ]
    }
  },
  
  ROW_SELECT: {
    description: "Handle table row selection",
    payload: {
      row: "Selected row data",
      tabIndex: "Index of the active tab",
      tabId: "ID of the active tab"
    },
    // Add a summary section that lists handlers in execution order
    summary: `
      Row selection processing steps:
      1. Update Form (ID: 1) - Updates the form with selected row data [scope: crudLayout]
      2. Update Selections (ID: 2) - Updates presenter's internal selections [scope: hierarchy]  
      3. Update Tab States (ID: 3) - Updates tab enabled/disabled states [scope: hierarchy]
    `,
    // Add handlerFlow to document dependencies
    handlerFlow: {
      order: [1, 2, 3],
      dependencies: {
        "2": [], // No dependencies
        "1": [], // No dependencies
        "3": ["2"] // Depends on handler 2 having run first
      }
    },
    handlers: [
      {
        id: 1,
        name: "Update form with selected row data",
        code: `setFormData(payload.row)`,
        priority: "high",
        scope: "crudLayout",
        implementation: (payload, context) => {
          // This handler only cares about updating the Form component
          if (context?.setFormData) {
            // Add more detailed logging for form data update
            const idField = payload.row?.id ? 'id' : 
              Object.keys(payload.row || {}).find(key => key.toLowerCase().endsWith('id'));
            
            log.debug('Updating form with row data', { 
              idField,
              id: payload.row?.[idField],
              tabId: payload.tabId,
              tabIndex: payload.tabIndex,
              fieldCount: Object.keys(payload.row || {}).length
            });
            
            // Pass form mode explicitly to ensure proper rendering
            context.setFormData(payload.row);
          } else {
            // Instead of just a warning, also provide guidance on fixing the issue
            log.warn('No setFormData method available in context', {
              contextSource: context?.__source || 'unknown',
              contextScope: context?.__scope || 'unknown',
              hasContext: !!context,
              contextKeys: context ? Object.keys(context) : []
            });
          }
        }
      },
      {
        id: 2,
        name: "Update presenter selections",
        code: `presenter.handleRowSelection(payload.tabIndex, payload.row)`,
        priority: "high", 
        scope: "hierarchy",
        implementation: (payload, context) => {
          // This handler only cares about the tab hierarchy presenter
          if (context?.presenter && typeof context.presenter.handleRowSelection === 'function') {
            try {
              const newSelections = context.presenter.handleRowSelection(
                payload.tabIndex, 
                payload.row, 
                context.presenter._selections || {}
              );
              
              if (newSelections) {
                context.presenter._selections = newSelections;
                log.debug('Updated presenter selections:', { newSelections });
              }
            } catch (err) {
              log.error('Error in handleRowSelection:', err);
            }
          }
        }
      },
      {
        id: 3,
        name: "Evaluate tab states after selection",
        code: `updateTabStates(presenter._selections)`,
        priority: "medium",
        scope: "hierarchy",
        // Add a note about dependencies
        dependsOn: [2],
        implementation: (payload, context) => {
          // Add detailed logging to diagnose context issues
          log.debug('Evaluate tab states handler received context:', {
            hasContext: !!context,
            contextKeys: context ? Object.keys(context) : [],
            hasPresenter: !!context?.presenter,
            source: context?.__source || 'unknown'
          });
          
          if (context?.presenter && context.presenter._selections) {
            // CRITICAL FIX: Ensure we update the UI state to reflect selection changes
            if (context.updateTabStates) {
              log.debug('Calling updateTabStates with:', context.presenter._selections);
              context.updateTabStates(context.presenter._selections);
            } else {
              log.warn('updateTabStates function not provided in context');
            }
            
            // CRITICAL FIX: Remove auto-tab activation to match Issue #25 requirements
            // Check if we should auto-activate the next tab
            const nextTabIndex = payload.tabIndex + 1;
            if (context.presenter.isTabEnabled) {
              const isNextTabEnabled = context.presenter.isTabEnabled(
                nextTabIndex, 
                context.presenter._selections
              );
              
              log.debug(`Next tab ${nextTabIndex} enabled check: ${isNextTabEnabled}`);
              
              // Remove automatic tab activation, just log the state
              if (isNextTabEnabled) {
                log.info(`Next tab ${nextTabIndex} is now enabled (but not auto-activated)`);
              }
            }
          } else {
            // ...existing error log...
          }
        }
      }
    ]
  },
  
  // Add a handler for the FORM.REFRESHED action to ensure form is properly cleared when tabs change
  FORM_REFRESHED: {
    description: "Handle form refresh requests",
    payload: {
      tabIndex: "Index of the active tab",
      tabId: "ID of the active tab",
      formMode: "Mode to set the form to (view, edit, add)"
    },
    summary: `
      Form refresh processing steps:
      1. Reset form data for new tab - Clears form data when tab changes
    `,
    handlers: [
      {
        name: "Reset form data for new tab",
        code: `resetFormData()`,
        priority: "high",
        implementation: (payload, context) => {
          if (context?.setFormData) {
            log.debug('Resetting form data for tab change', { 
              tabIndex: payload.tabIndex,
              formMode: payload.formMode || 'view'
            });
            
            // Clear form data and set to the specified mode
            context.setFormData({}, payload.formMode || 'view');
          }
        }
      }
    ]
  }
};

export default selectionHandlers;
