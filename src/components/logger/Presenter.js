import { getLoggerTableData } from '../../utils/logger';

export class Presenter {
  static instance = null;
  static ACTION_SEQUENCES = [];
  static MAX_SEQUENCES = 10; // Limit number of stored sequences
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new Presenter();
    }
    return this.instance;
  }

  getMetricsData() {
    return getLoggerTableData();
  }

  startUserAction(actionType) {
    const actionInfo = {
      actionName: actionType,
      startTime: new Date().toLocaleTimeString(),
      sequence: []
    };
    
    // Maintain limited history
    if (Presenter.ACTION_SEQUENCES.length >= Presenter.MAX_SEQUENCES) {
      Presenter.ACTION_SEQUENCES.shift(); // Remove oldest
    }
    
    Presenter.ACTION_SEQUENCES.push(actionInfo);
    Presenter.currentAction = actionInfo;
    
    // Trigger UI update
    window.dispatchEvent(new Event('logUpdate'));
  }

  addToSequence(event) {
    if (Presenter.currentAction) {
      Presenter.currentAction.sequence.push({
        ...event,
        time: new Date().toLocaleTimeString()
      });
    }
  }

  getActionSequence() {
    return Presenter.ACTION_SEQUENCES.length > 0 
      ? Presenter.ACTION_SEQUENCES[Presenter.ACTION_SEQUENCES.length - 1]
      : null;
  }

  getAllSequences() {
    return [...Presenter.ACTION_SEQUENCES];
  }

  clearActionSequences() {
    Presenter.ACTION_SEQUENCES = [];
    Presenter.currentAction = null;
  }
}
