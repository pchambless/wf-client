# Action System

## Overview

The WhatsFresh client uses a custom action system based on the publish-subscribe pattern for state management and component communication. This lightweight approach provides flexibility without the complexity of larger state management libraries.

## Core Concepts

### Actions

Actions are events that occur in the application, with associated data:

```javascript
{
  type: 'ROW_SELECT',
  payload: {
    id: 123,
    source: 'table',
    row: { /* row data */ }
  }
}
```

### Action Types

Action types are constants that define the available actions:

```javascript
export const SELECTION = {
  ROW_SELECT: 'ROW_SELECT',
  TAB_CHANGE: 'TAB_CHANGE',
};

export const FORM = {
  SUBMIT: 'FORM_SUBMIT',
  CANCEL: 'FORM_CANCEL',
};
```

### Subscribers

Components that need to respond to actions can subscribe to specific action types:

```javascript
useEffect(() => {
  const unsubscribe = subscribeToAction(SELECTION.ROW_SELECT, handleRowSelect);
  return unsubscribe;
}, []);
```

## API

### `triggerAction(type, payload)`

Dispatches an action to all subscribers:

```javascript
import { triggerAction, SELECTION } from '../actions/actionStore';

const handleClick = (row) => {
  triggerAction(SELECTION.ROW_SELECT, { 
    id: row.id, 
    row,
    source: 'table' 
  });
};
```

### `subscribeToAction(type, callback)`

Registers a callback to be called when an action is triggered:

```javascript
import { subscribeToAction, SELECTION } from '../actions/actionStore';

useEffect(() => {
  const unsubscribe = subscribeToAction(
    SELECTION.ROW_SELECT,
    (payload) => {
      setSelectedId(payload.id);
    }
  );
  
  // Clean up subscription when component unmounts
  return unsubscribe;
}, []);
```

### `setVar(key, value)` and `getVar(key)`

Manages global variables for cross-component communication:

```javascript
import { setVar, getVar } from '../utils/externalStore';

// Setting a variable
setVar(':productId', 123);

// Getting a variable
const productId = getVar(':productId');
```

## Best Practices

- Use consistent naming for action types
- Keep payloads simple and serializable
- Always unsubscribe when components unmount
- Use action creators for complex action logic
- Document the expected payload structure
