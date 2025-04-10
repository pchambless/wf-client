# Getting Started with WhatsFresh Client

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wf-client
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file to add your API endpoint and other required configuration.

## Development Workflow

### Starting the Development Server

```bash
npm start
```

This will start the application in development mode at [http://localhost:3000](http://localhost:3000).

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Navigation

### Key Directories

- `src/components` - Reusable UI components
- `src/pages` - Page-level components for each section
- `src/presenters` - Business logic separated from UI
- `src/actions` - Action creators and event handlers

### Key Files

- `src/App.js` - Main application component
- `src/index.js` - Application entry point

## Creating a New Module

To create a new module (like Products, Ingredients, etc.):

1. Create a directory under `src/pages`
2. Create configuration files for tab structure
3. Implement or reuse presenters for business logic
4. Register the new module in the router

Follow the existing modules as templates for consistent implementation.
