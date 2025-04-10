# API Integration

## Overview

The WhatsFresh client communicates with a backend API to fetch and manipulate data. This documentation outlines the API integration patterns used in the application.

## API Service

The application uses a centralized API service for making requests:

```javascript
// src/services/api.js
export const fetchData = async (endpoint, params = {}) => {
  // Implementation details
};

export const createData = async (endpoint, data) => {
  // Implementation details
};

export const updateData = async (endpoint, id, data) => {
  // Implementation details
};

export const deleteData = async (endpoint, id) => {
  // Implementation details
};
```

## Event-Driven API Calls

The application uses a convention where API endpoints are referenced by event names in configurations:

```javascript
const tabConfig = {
  label: 'Products',
  listEvent: 'productList', // Maps to API endpoint
  idField: 'productId'
};
```

## Authentication

API requests include authentication headers:

```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
};
```

## Error Handling

API errors are handled consistently across the application:

```javascript
try {
  const data = await fetchData(endpoint);
  // Process successful response
} catch (error) {
  // Handle errors
  if (error.status === 401) {
    // Handle authentication errors
  } else {
    // Handle other errors
  }
}
```

## Common Endpoints

### List Endpoints

Used to fetch lists of items:

- GET `/api/products` - List all products
- GET `/api/ingredients` - List all ingredients
- GET `/api/types` - List all types

### Detail Endpoints

Used to fetch single items:

- GET `/api/products/{id}` - Get a specific product
- GET `/api/ingredients/{id}` - Get a specific ingredient
- GET `/api/types/{id}` - Get a specific type

### Create Endpoints

Used to create new items:

- POST `/api/products` - Create a new product
- POST `/api/ingredients` - Create a new ingredient
- POST `/api/types` - Create a new type

### Update Endpoints

Used to update existing items:

- PUT `/api/products/{id}` - Update a specific product
- PUT `/api/ingredients/{id}` - Update a specific ingredient
- PUT `/api/types/{id}` - Update a specific type

### Delete Endpoints

Used to delete items:

- DELETE `/api/products/{id}` - Delete a specific product
- DELETE `/api/ingredients/{id}` - Delete a specific ingredient
- DELETE `/api/types/{id}` - Delete a specific type

## API Configuration

API endpoints and behavior can be configured in the environment:

```
REACT_APP_API_URL=https://api.whatsfresh.com/v1
REACT_APP_API_TIMEOUT=5000
```
