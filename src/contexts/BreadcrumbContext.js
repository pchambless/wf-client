import React, { createContext, useContext, useState, useCallback } from 'react';
import createLogger from '../utils/logger';

const log = createLogger('BreadcrumbContext');
const BreadcrumbContext = createContext(null);

// Define standard display fields for different entity types
const displayFields = {
  // Ingredients
  ingredientType: 'ingrTypeName',
  ingredient: 'ingrName',
  ingredientBatch: 'btchNbr',
  
  // Products
  productType: 'prodTypeName',
  product: 'prodName',
  productBatch: 'btchNbr',
  
  // Fallbacks
  defaultField: 'name',
  idField: 'id'
};

/**
 * BreadcrumbProvider manages the breadcrumb trail across navigation
 */
export const BreadcrumbProvider = ({ children }) => {
  const [crumbs, setCrumbs] = useState([
    { label: 'Dashboard', path: '/welcome' }
  ]);
  
  /**
   * Add a crumb to the trail
   */
  const addCrumb = useCallback((newCrumb) => {
    setCrumbs(prev => {
      // Check if we already have this path in our crumbs
      const existingIndex = prev.findIndex(c => c.path === newCrumb.path);
      
      if (existingIndex >= 0) {
        // If it exists, replace it and truncate the trail there
        const updated = [...prev.slice(0, existingIndex), newCrumb];
        log.debug('Updated existing crumb in trail:', { updated });
        return updated;
      } else {
        // Otherwise add to the end
        const updated = [...prev, newCrumb];
        log.debug('Added new crumb to trail:', { updated });
        return updated;
      }
    });
  }, []);
  
  /**
   * Add an entity crumb with proper display field extraction
   */
  const addEntityCrumb = useCallback((entity, entityType, path) => {
    if (!entity) {
      log.warn('Cannot add entity crumb, entity is null or undefined');
      return;
    }
    
    // Get the field to use for display
    const displayField = displayFields[entityType] || displayFields.defaultField;
    
    // Get the ID field for fallback
    const idField = entityType.endsWith('Type') ? 
      `${entityType}ID` : 
      entityType === 'ingredient' ? 'ingrID' :
      entityType === 'product' ? 'prodID' :
      (entityType.includes('batch') ? 'btchID' : displayFields.idField);
    
    // Try to get display value from entity
    const displayValue = entity[displayField] || 
                        entity.name || 
                        (entity[idField] && `#${entity[idField]}`) || 
                        'Unknown';
    
    // Use the display value directly without adding type prefix
    const label = displayValue;
    
    // Create and add the crumb
    const crumb = { label, path, entity, entityType };
    addCrumb(crumb);
    
    log.debug(`Added ${entityType} crumb:`, { 
      label, 
      displayField, 
      displayValue, 
      hasEntity: !!entity 
    });
  }, [addCrumb]);
  
  /**
   * Set an entire trail of crumbs at once
   */
  const setCrumbTrail = useCallback((trail) => {
    if (!Array.isArray(trail) || trail.length === 0) {
      log.warn('Invalid crumb trail provided:', trail);
      return;
    }
    
    // Always ensure Dashboard is first
    const dashboard = { label: 'Dashboard', path: '/welcome' };
    const newTrail = trail[0]?.path === '/welcome' ? trail : [dashboard, ...trail];
    
    log.debug('Setting complete crumb trail:', { newTrail });
    setCrumbs(newTrail);
  }, []);
  
  /**
   * Navigate to a specific crumb and truncate trail
   */
  const navigateToCrumb = useCallback((path) => {
    setCrumbs(prev => {
      const index = prev.findIndex(c => c.path === path);
      if (index >= 0) {
        return prev.slice(0, index + 1);
      }
      return prev;
    });
  }, []);
  
  const contextValue = {
    crumbs,
    addCrumb,
    addEntityCrumb,
    setCrumbTrail,
    navigateToCrumb
  };
  
  return (
    <BreadcrumbContext.Provider value={contextValue}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

/**
 * Hook to use breadcrumb context
 */
export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbContext);
  
  if (!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbProvider');
  }
  
  return context;
};
