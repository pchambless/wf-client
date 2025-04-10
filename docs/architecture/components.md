# Component Structure

## Overview

The WhatsFresh client uses a hierarchical component structure to promote reusability, maintainability, and consistency across the application. Components are organized by function and complexity.

## Component Hierarchy

1. **Core Components**: Basic building blocks like buttons, inputs, and cards
2. **Composite Components**: Combinations of core components that implement specific functionalities
3. **Page Components**: Full pages that combine multiple composite components
4. **Layout Components**: Define the overall structure of the application

## Component Categories

### UI Components

Basic presentational components that handle rendering and user interactions:

- `Button`
- `TextField`
- `SelectField`
- `DatePicker`
- `Checkbox`

### Container Components

Components that manage data and state:

- `Table`
- `Form`
- `Filter`
- `SearchBar`

### Tab Components

Components for managing tabbed interfaces:

- `HierTabs`: For hierarchical data relationships
- `JustTabs`: For independent tab interfaces

### Page Components

Full pages for different modules:

- `ProductsPage`
- `IngredientsPage`
- `TypesPage`
- `AccountsPage`

## Component Design Principles

### Props API

Components receive their configuration and behavior through props:

```javascript
<Table 
  columnMap={columnMaps.Products}
  listEvent="productList"
  onRowSelect={handleRowSelect}
  selectedId={selectedProduct.id}
/>
```

### Event Handling

Components communicate with each other through a standardized action system:

```javascript
// Publishing an event
triggerAction(SELECTION.ROW_SELECT, { id, row, source: 'table' });

// Subscribing to an event
useEffect(() => {
  const unsubscribe = subscribeToAction(SELECTION.ROW_SELECT, handleRowSelect);
  return unsubscribe;
}, []);
```

### Composition

Complex components are built by composing simpler components:

```javascript
const ProductForm = () => (
  <Form>
    <TextField name="name" label="Product Name" />
    <SelectField name="typeId" label="Product Type" options={productTypes} />
    <Checkbox name="active" label="Active" />
    <Button type="submit">Save</Button>
  </Form>
);
```

## Styling

Components use Material-UI for styling with occasional custom CSS overrides for specific requirements.
