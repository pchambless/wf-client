import createLogger from '../../utils/logger';
import { ACTION_TYPES, startUserAction } from '../../utils/logger/actions';

const TAB_NAMES = ['Type', 'Ingredient', 'Batch'];

export class IngredientPresenter {
  constructor() {
    this.log = createLogger('Ingredient.Presenter');
    this.listLog = createLogger('Ingredient.Presenter.List');
    this.selectionLog = createLogger('Ingredient.Presenter.Selection');
    this.tabLog = createLogger('Ingredient.Presenter.Tab');
    
    // Initialization log in next tick to avoid React warnings
    Promise.resolve().then(() => {
      this.log.info('Init Ingredient Presenter');
    });
  }

  getListEvent(tabIndex, selections, config) {
    if (!config[tabIndex]) {
      this.listLog.warn('No config for tab:', { 
        index: tabIndex, 
        available: Object.keys(config)
      });
      return null;
    }

    // Just return the event name string
    const eventName = config[tabIndex].listEvent;
    if (eventName) {
      this.listLog.debug('List event:', { 
        tab: TAB_NAMES[tabIndex],
        event: eventName
      });
    }
    
    return eventName;
  }

  handleRowSelection(activeTab, row, currentSelections) {
    const tabName = TAB_NAMES[activeTab];
    startUserAction(`${ACTION_TYPES.ROW_CLICK} - ${tabName}`);
    
    this.selectionLog.debug('Row selection:', { 
      tab: tabName,
      rowId: row?.id,
      current: currentSelections
    });
    
    switch(activeTab) {
      case 0:
        return {
          ingrType: row,
          ingredient: null,
          batch: null
        };
      case 1:
        return {
          ...currentSelections,
          ingredient: row,
          batch: null
        };
      case 2:
        return {
          ...currentSelections,
          batch: row
        };
      default:
        this.selectionLog.warn('Invalid tab:', activeTab);
        return currentSelections;
    }
  }

  handleTabChange(index) {
    startUserAction(`${ACTION_TYPES.TAB_CLICK} - ${TAB_NAMES[index]}`);
    this.tabLog.debug('Tab change:', { 
      from: TAB_NAMES[index - 1] || 'none',
      to: TAB_NAMES[index]
    });
  }

  isTabEnabled(index, selections) {
    const enabled = (
      index === 0 || 
      (index === 1 && !!selections.ingrType) ||
      (index === 2 && !!selections.ingredient)
    );
    
    if (!enabled) {
      this.tabLog.debug('Tab disabled:', { 
        tab: TAB_NAMES[index],
        reason: !selections.ingrType ? 'No type selected' : 'No ingredient selected'
      });
    }
    
    return enabled;
  }
}
