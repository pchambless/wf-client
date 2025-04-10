# WhatsFresh Client Documentation

## Documentation Structure

This documentation covers the WhatsFresh Client application, a React-based system for managing food production data.

### Contents

1. [Getting Started](getting-started.md)
2. [Architecture](architecture/README.md)
   - [Component Structure](architecture/components.md)
   - [Presenters](architecture/presenters.md)
   - [Action System](architecture/actions.md)
3. [Tab Systems](tab-systems/README.md)
   - [Hierarchical Tabs](tab-systems/hier-tabs.md)
   - [Non-Hierarchical Tabs](tab-systems/just-tabs.md)
4. [Data Models](models/README.md)
5. [API Integration](api/README.md)

## Overview

The WhatsFresh Client is a modular React application that provides interfaces for managing food production data. It uses a component-based architecture with reusable tab interfaces to create consistent user experiences across different data domains.

### Key Features

- **Modular Design**: Each business domain has a dedicated module with consistent patterns
- **Hierarchical Data Management**: Parent-child relationships are handled through connected tabs
- **Config-Driven UI**: Most UI structures are defined in configuration objects
- **Consistent CRUD Operations**: Standard patterns for Create, Read, Update, Delete across all data types
- **Presenter Pattern**: Business logic is separated from UI components

## Core Principles

1. **Consistency**: Similar operations work the same way across the application
2. **Modularity**: Components are designed to be reused across different contexts
3. **Configuration Over Code**: Behavior changes are primarily made through configuration
4. **Separation of Concerns**: UI components don't contain business logic

## Getting Started

To start working with the codebase, see the [Getting Started](getting-started.md) guide.

## Main Modules

The application is divided into several key modules:

- **Products**: Management of product definitions
- **Ingredients**: Management of ingredient data
- **Types**: Management of categorization systems
- **Accounts**: User and permission management
- **Reporting**: Data analysis and export features

Each module follows the same architectural patterns but may have domain-specific customizations.
