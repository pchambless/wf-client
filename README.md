# WhatsFresh Client

## Overview

The WhatsFresh Client is a React application that provides a modular, configurable interface for managing food production data. It uses a component-based architecture with reusable tab interfaces to create consistent user experiences across different data domains.

## Key Components

### Tab Navigation Systems

The application features two primary tab components:

- **HierTabs**: For hierarchical data relationships (parent-child relationships across tabs)
- **JustTabs**: For non-hierarchical, independent tab interfaces

### Core Architecture

- **Presenter Pattern**: Business logic is separated from UI components
- **Config-Driven Design**: Page layouts and behaviors are defined in configuration objects
- **Action System**: Global state management through a publish-subscribe pattern

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Tab Component Configuration

Tab-based pages are configured using standard patterns:

```javascript
const pageConfig = {
    pageName: 'Products',
    tabConfiguration: [
        {
            label: 'Product Types',
            columnMap: columnMap.ProductTypes,
            listEvent: 'prodTypeList',
            idField: 'prodTypeID'
        },
        // Additional tabs...
    ]
};
```

## Directory Structure
