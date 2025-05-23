/**
 * Utilities for working with navigation structure
 * This combines routes and sections information
 */
import { SECTIONS, getAllSections } from './NavigationSections';
import ROUTES from '../routes/Routes';
import createLogger from '@utils/logger';

const log = createLogger('NavigationUtils');

/**
 * Organize routes into sections for sidebar display
 */
export function getNavigationSections() {
  log.debug('Building navigation sections');
  
  // Initialize sections with their base structure
  const sections = getAllSections().reduce((acc, section) => {
    acc[section.id] = {
      ...section,
      items: []
    };
    return acc;
  }, {});
  
  // Organize routes into their sections
  Object.entries(ROUTES).forEach(([routeKey, route]) => {
    if (route.section && sections[route.section]) {
      sections[route.section].items.push({
        id: routeKey,
        ...route
      });
    } else if (route.section) {
      log.warn(`Route ${routeKey} has unknown section: ${route.section}`);
    }
  });
  
  // Sort items within each section
  Object.keys(sections).forEach(sectionKey => {
    sections[sectionKey].items.sort((a, b) => 
      (a.itemOrder || 999) - (b.itemOrder || 999)
    );
  });
  
  // Filter to only include sections with items and convert to array
  const sortedSections = Object.values(sections)
    .filter(section => section.items.length > 0)
    .sort((a, b) => (a.order || 999) - (b.order || 999));
  
  return sortedSections;
}

/**
 * Find the section a route belongs to
 */
export function getRouteSection(routeKey) {
  const route = ROUTES[routeKey];
  if (!route || !route.section) return null;
  
  return SECTIONS[route.section];
}

/**
 * Get breadcrumb information for a route
 */
export function getRouteBreadcrumbs() {
  // Implementation for breadcrumb generation
  // Would be based on your navigation structure
  return [];
}
