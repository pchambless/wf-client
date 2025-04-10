# WhatsFresh Architecture

## Overview

The WhatsFresh Client uses a component-based architecture that emphasizes separation of concerns, reusability, and configuration-driven development. The application is built using React with a custom state management approach based on a publish-subscribe pattern.

## Key Architectural Principles

### Separation of Concerns

The application separates business logic from UI components using the Presenter pattern:

- **UI Components**: Handle rendering and user interactions
- **Presenters**: Contain business logic, data processing, and API interactions
- **Configuration Objects**: Define the structure and behavior of pages

### Configuration-Driven Development

Most aspects of the application are configured through JavaScript objects rather than hardcoded:

- Page structures are defined in configuration objects
- Tab configurations specify data sources and relationships
- Column definitions determine how data is displayed

This approach allows for rapid development of new features without significant code changes.

### Component Reusability

The application is built around highly reusable components:

- Tab systems can be reused across different data domains
- Form components can handle different data structures
- Table components can display various data types

## Technology Stack

- **Frontend Framework**: React
- **UI Library**: Material UI
- **State Management**: Custom action system (publish-subscribe pattern)
- **API Communication**: Fetch API with custom wrappers
- **Routing**: React Router
- **Testing**: Jest and React Testing Library

## Further Reading

For more details on specific aspects of the architecture, see:

- [Component Structure](components.md)
- [Presenters](presenters.md)
- [Action System](actions.md)
