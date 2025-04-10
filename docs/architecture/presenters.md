# Presenters

## Overview

The WhatsFresh client uses the Presenter pattern to separate business logic from UI components. Presenters handle data processing, API interactions, and complex logic, while UI components focus solely on rendering and user interactions.

## Types of Presenters

### HierPresenter

Handles hierarchical data relationships for pages that use the `HierTabs` component:

```javascript
import HierPresenter from '../../presenters/HierPresenter';

class ProductPresenter extends HierPresenter {
  // Product-specific implementations
}
```

### JustPresenter

Handles non-hierarchical data for pages that use the `JustTabs` component:

```javascript
import JustPresenter from '../../presenters/JustPresenter';

class AccountPresenter extends JustPresenter {
  // Account-specific implementations
}
```

### TablePresenter

Manages data fetching and display for table components:

```javascript
import { TablePresenter } from '../components/crud/Table/Presenter';

const tablePresenter = new TablePresenter(columnMap, listEvent);
```

## Common Presenter Methods

### Data Fetching

Presenters handle API calls and data transformation:

```javascript
async fetchProducts(tabIndex = 0) {
  const listEvent = this.getListEvent(tabIndex);
  const response = await fetchData(listEvent);
  return this.transformData(response);
}
```

### Configuration Management

Presenters provide access to configuration with safety checks:

```javascript
getTabConfig(index = 0) {
  if (!Array.isArray(this.config.tabConfiguration) || 
      !this.config.tabConfiguration[index]) {
    return { label: `Missing Tab ${index}`, columnMap: {}, listEvent: '' };
  }
  return this.config.tabConfiguration[index];
}
```

### Validation

Presenters handle data validation logic:

```javascript
validateForm(formData) {
  const errors = {};
  if (!formData.name) errors.name = 'Name is required';
  if (!formData.typeId) errors.typeId = 'Type is required';
  return errors;
}
```

## Implementing a New Presenter

1. Determine whether your data has hierarchical relationships
2. Extend either `HierPresenter` or `JustPresenter`
3. Implement domain-specific methods
4. Connect the presenter to your UI components

## Best Practices

- Keep UI logic in components, business logic in presenters
- Use dependency injection for services
- Implement error handling in presenters
- Add logging for debugging complex operations
- Add validation for data integrity
