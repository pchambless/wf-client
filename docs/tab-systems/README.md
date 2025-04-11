# Tab Systems

## Overview

The WhatsFresh client uses tab-based interfaces to organize related data and provide intuitive navigation. There are two main tab systems:

1. **Hierarchical Tabs (HierTabs)**: For managing parent-child data relationships
2. **Non-hierarchical Tabs (JustTabs)**: For managing independent data sets

## Common Features

Both tab systems share these features:

- Tab-based navigation
- Consistent table displays for data
- CRUD operations within each tab
- Configuration-driven setup

## Configuration Structure

Tab systems are configured using standard configuration objects:

```javascript
const pageConfig = {
  pageName: 'Products',
  tabConfig: [
    {
      label: 'Tab 1',
      columnMap: columnMaps.Tab1,
      listEvent: 'tab1List',
      idField: 'id'
    },
    {
      label: 'Tab 2',
      columnMap: columnMaps.Tab2,
      listEvent: 'tab2List',
      idField: 'id',
      parentIdField: 'parentId' // For hierarchical tabs only
    }
  ]
};
```

## Implementation Details

- Tab components handle their own state management
- Active tab is tracked and persisted during navigation
- Data loading is triggered when tabs are activated
- Selection state is maintained within each tab

## Further Reading

For more detailed information about each tab system:

- [Hierarchical Tabs](hier-tabs.md)
- [Non-hierarchical Tabs](just-tabs.md)
