# Non-hierarchical Tabs (JustTabs)

## Overview

Non-hierarchical Tabs (JustTabs) are used for managing independent data sets in the WhatsFresh client. This component provides a simple tab interface where each tab operates independently from the others.

## Use Cases

- User Management → Users, Roles, Permissions
- Settings → General, Display, Notifications
- Reports → Sales, Inventory, Production

## Component Structure

```javascript
<JustTabs 
  config={pageConfig}
  presenter={pagePresenter}
/>
```

## Configuration

JustTabs use a configuration structure similar to HierTabs but without parent-child relationships:

```javascript
const accountsConfig = {
  pageName: 'Accounts',
  tabConfig: [
    {
      label: 'Users',
      columnMap: columnMaps.Users,
      listEvent: 'userList',
      idField: 'userId'
    },
    {
      label: 'Roles',
      columnMap: columnMaps.Roles,
      listEvent: 'roleList',
      idField: 'roleId'
    },
    {
      label: 'Permissions',
      columnMap: columnMaps.Permissions,
      listEvent: 'permissionList',
      idField: 'permissionId'
    }
  ]
};
```

## Behavior

1. All tabs are accessible at any time, regardless of selections
2. Each tab maintains its own selection state
3. Tabs load their data independently when activated
4. Switching between tabs preserves the state of each tab

## Data Flow

1. User selects a tab
2. Tab component loads data using its configured listEvent
3. Selection within a tab is managed independently
4. Selection events are broadcast through the action system
5. Other components can subscribe to these events if needed

## Implementation with JustPresenter

JustTabs are typically used with the JustPresenter:

```javascript
import JustPresenter from '../../presenters/JustPresenter';

class AccountsPresenter extends JustPresenter {
  // Accounts-specific implementations
}

const presenter = new AccountsPresenter(accountsConfig);
```

The presenter handles:
- Retrieving configuration based on tab index
- Providing safe access to configuration properties without parent-child relationship management

## Differences from HierTabs

- No parent-child relationships between tabs
- All tabs are accessible at all times
- No parentIdField in configuration
- Simpler implementation for independent data sets
