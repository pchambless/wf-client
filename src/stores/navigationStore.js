import { makeAutoObservable } from 'mobx';
import createLogger from '../utils/logger';

const log = createLogger('NavigationStore');

class NavigationStore {
  // Current navigation state
  currentPath = '';
  currentPage = '';
  pageTitle = 'WhatsFresh';
  
  // Breadcrumbs state (simplified and generic)
  breadcrumbs = [{ label: 'Home', path: '/welcome' }];
  
  constructor() {
    makeAutoObservable(this);
  }
  
  // Set page information
  setCurrentPage(page, path, title) {
    this.currentPage = page;
    this.currentPath = path;
    
    if (title) {
      this.setPageTitle(title);
    } else {
      // Generate title from page name if not provided
      this.setPageTitle(page);
    }
    
    log.debug('Page changed', { page, path, title });
  }
  
  // Page title (replaces pageStore.setPageTitle)
  setPageTitle(title) {
    this.pageTitle = title ? `WhatsFresh - ${title}` : 'WhatsFresh';
    document.title = this.pageTitle;
  }
  
  // Generic breadcrumb methods
  setBreadcrumbs(breadcrumbs) {
    // Ensure Home is always first
    const homeCrumb = { label: 'Home', path: '/welcome' };
    this.breadcrumbs = [homeCrumb, ...breadcrumbs.filter(c => c.path !== '/welcome')];
  }
  
  // Helper for entity-based navigation
  setEntityBreadcrumbs(entities) {
    const crumbs = [{ label: 'Home', path: '/welcome' }];
    
    // Build breadcrumbs based on entity hierarchy
    // Example: Home > Ingredients > Spices > Salt > Batch #123
    Object.entries(entities).forEach(([type, entity]) => {
      if (!entity) return;
      
      // Add category/list page if this is first entity
      if (crumbs.length === 1) {
        const listPath = `/${type.toLowerCase()}s`; // e.g., /ingredients
        crumbs.push({
          label: type.charAt(0).toUpperCase() + type.slice(1) + 's', // e.g., Ingredients
          path: listPath
        });
      }
      
      // Add the entity itself
      crumbs.push({
        label: entity.name || `${type} #${entity.id}`,
        path: this.buildEntityPath(entities, type)
      });
    });
    
    this.breadcrumbs = crumbs;
    log.debug('Set entity breadcrumbs', { entities, crumbs });
  }
  
  // Build path for entity based on hierarchy
  buildEntityPath(entities, currentType) {
    // Example: /ingredients/5/12 for ingredient ID 12 of type ID 5
    const types = ['ingrType', 'ingredient', 'batch']; // Order matters!
    const base = `/${currentType.toLowerCase().replace('Type', '')}s`; // e.g., /ingredients
    
    // Build path components
    const pathParts = [];
    for (const type of types) {
      if (entities[type]) {
        pathParts.push(entities[type].id);
      }
      // Stop once we reach the current type
      if (type === currentType) break;
    }
    
    return pathParts.length ? `${base}/${pathParts.join('/')}` : base;
  }
}

const navigationStore = new NavigationStore();
export default navigationStore;
