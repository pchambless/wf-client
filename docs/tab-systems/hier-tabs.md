# Hierarchical Tabs (HierTabs)

## Overview

Hierarchical Tabs are used for managing parent-child data relationships in the WhatsFresh client. This component allows navigation through related data sets where each level depends on the selection in the previous level.

## Use Cases

- Products → Product Variants → Variant Specifications
- Type Categories → Types → Sub-Types
- Ingredients → Ingredient Suppliers → Supplier Pricing

## Component Structure

```javascript
<HierTabs 
  config={pageConfig}
  presenter={pagePresenter}
/>
```

## Configuration

HierTabs require a specific configuration structure that defines the parent-child relationships:

```javascript
const typesConfig = {
  pageName: 'Types',
  tabConfiguration: [
    {
      label: 'Type Categories',
      columnMap: columnMaps.TypeCategories,
      listEvent: 'typeCategoryList',
      idField: 'typeCategoryID'
    },
    {
      label: 'Types',
      columnMap: columnMaps.Types,
      listEvent: 'typeList',
      idField: 'typeID',
      parentIdField: 'typeCategoryID' // References the parent tab's idField
    },
    {
      label: 'Sub Types',
      columnMap: columnMaps.SubTypes,
      listEvent: 'subTypeList',
      idField: 'subTypeID',
      parentIdField: 'typeID' // References the previous tab's idField
    }
  ]
};
```

## Behavior

1. When the page loads, only the first tab is active and populated
2. When a row is selected in Tab 1, Tab 2 becomes active and loads data related to that selection
3. When a row is selected in Tab 2, Tab 3 becomes active and loads data related to that selection
4. This pattern continues for any number of tabs
5. Changing a selection in a parent tab will clear selections in all child tabs

## Data Flow

1. Parent tab sets a selection variable (e.g., `:typeCategoryID = 5`)
2. Child tab uses this variable in its data query (`WHERE typeCategoryID = 5`)
3. Selection events are broadcast through the action system
4. Tab component subscribes to selection events to update its state

## Implementation with HierPresenter

HierTabs are typically used with the HierPresenter:

```javascript
import HierPresenter from '../../presenters/HierPresenter';

class TypesPresenter extends HierPresenter {
  // Types-specific implementations
}

const presenter = new TypesPresenter(typesConfig);
```

The presenter handles:
- Retrieving configuration based on tab index
- Managing parent-child relationships
- Providing safe access to configuration properties
