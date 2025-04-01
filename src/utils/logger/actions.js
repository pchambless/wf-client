export const ACTION_TYPES = {
  ROW_CLICK: 'RowClick',
  SUBMIT: 'Submit',
  ADD_NEW: 'AddNew',
  TAB_CLICK: 'TabClick'
};

const MAX_SEQUENCES = 100; // Prevent memory leak
const ACTION_SEQUENCES = [];
let currentAction = null;

export const getLastActionSequence = () => {
  return ACTION_SEQUENCES.length > 0 
    ? ACTION_SEQUENCES[ACTION_SEQUENCES.length - 1] 
    : null;
};

export const startUserAction = (actionType) => {
  // Prevent memory leak by limiting sequence history
  if (ACTION_SEQUENCES.length > MAX_SEQUENCES) {
    ACTION_SEQUENCES.splice(0, ACTION_SEQUENCES.length - MAX_SEQUENCES);
  }
  
  currentAction = {
    actionName: actionType,
    startTime: new Date().toLocaleTimeString(),
    sequence: []
  };
  ACTION_SEQUENCES.push(currentAction);
};

export const addToSequence = (event) => {
  if (currentAction) {
    currentAction.sequence.push(event);
  }
};
