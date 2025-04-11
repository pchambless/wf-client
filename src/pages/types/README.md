# Types Management Module

## Overview

The Types module provides interfaces for managing various type definitions used throughout the WhatsFresh application. Types represent categorization systems and standardized reference data that other modules depend upon.

## Features

- CRUD operations for different type categories
- Hierarchical relationships between related types
- Validation rules for type integrity
- Reference counting to prevent deletion of types in use

## Implementation

This module uses the tab navigation pattern with hierarchical relationships:

```javascript
const typesConfig = {
    pageName: 'Types',
    tabConfig: [
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
            parentIdField: 'typeCategoryID'
        },
        {
            label: 'Sub Types',
            columnMap: columnMaps.SubTypes,
            listEvent: 'subTypeList',
            idField: 'subTypeID',
            parentIdField: 'typeID'
        }
    ]
};
```

## Usage

The Types module is a foundational component that should be configured early in the application setup process. Other modules reference these types through their respective IDs:

```javascript
// Example: Using a type in product configuration
const product = {
    name: 'Pacific Salmon',
    typeID: 12, // References 'Seafood' type
    subTypeID: 45 // References 'Fish' subtype
    // other properties...
};
```

## Related Components

- **TypeSelector**: Reusable component for selecting from available types
- **TypeBadge**: Visual indicator component showing type categorization
- **TypeFilter**: Filter component for filtering data by type

## API Endpoints

The module interacts with the following API endpoints:

- GET/POST/PUT/DELETE `/api/type-categories`
- GET/POST/PUT/DELETE `/api/types`
- GET/POST/PUT/DELETE `/api/sub-types`
