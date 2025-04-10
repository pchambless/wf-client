# Data Models

## Overview

The WhatsFresh client interfaces with several data models that represent the business domain. This documentation outlines the core data models and their relationships.

## Core Models

### Products

Products represent the items that are produced and sold:

```javascript
{
  productId: 1,
  name: 'Pacific Salmon',
  description: 'Fresh wild-caught salmon',
  typeId: 12,
  active: true,
  createdAt: '2023-01-15T12:00:00Z',
  updatedAt: '2023-02-20T14:30:00Z'
}
```

### Ingredients

Ingredients are components used in products:

```javascript
{
  ingredientId: 101,
  name: 'Salt',
  description: 'Sea salt for preservation',
  typeId: 5,
  cost: 1.25,
  unit: 'kg',
  active: true
}
```

### Types

Types provide categorization across the system:

```javascript
{
  typeId: 12,
  name: 'Seafood',
  description: 'Fish and seafood products',
  typeCategoryId: 3,
  active: true
}
```

### Type Categories

Type Categories group related types:

```javascript
{
  typeCategoryId: 3,
  name: 'Product Categories',
  description: 'Categories for organizing products',
  active: true
}
```

### Users

Users represent people who can access the system:

```javascript
{
  userId: 42,
  username: 'jsmith',
  firstName: 'John',
  lastName: 'Smith',
  email: 'john.smith@example.com',
  roleId: 2,
  active: true
}
```

## Model Relationships

- **Products** have **Types** and can contain **Ingredients**
- **Ingredients** have **Types** and can be used in **Products**
- **Types** belong to **Type Categories** and can have **Sub-Types**
- **Type Categories** contain **Types**
- **Users** have **Roles** which have **Permissions**

## Data Validation

Each model has validation rules that are enforced in the application:

- Required fields must be provided (e.g., name, typeId)
- Numeric fields must be valid numbers
- IDs must reference existing records
- Text fields have maximum length constraints

## Working with Models

The application uses these models in various components:

- **Tables**: Display lists of model instances
- **Forms**: Create and edit model instances
- **Filters**: Search and filter model instances
- **Relationships**: Connect related models together

All models are typically accessed through the API and aren't directly defined in the client code.
