/**
 * Navigation section definitions for the sidebar
 */

export const SECTIONS = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'Dashboard',
    color: '#FFFFFF', // White/default
    order: 10
  },
  ingredients: {
    id: 'ingredients',
    label: 'Ingredients',
    icon: 'Restaurant',
    color: '#FBD3E9', // Pink
    order: 20
  },
  products: {
    id: 'products',
    label: 'Products',
    icon: 'Fastfood',
    color: '#D0E1F9', // Blue
    order: 30
  },
  maps: {
    id: 'maps',
    label: 'Maps',
    icon: 'Map',
    color: '#C4EABD', // Green
    order: 40
  },
  reference: {
    id: 'reference',
    label: 'Reference',
    icon: 'Book',
    color: '#E0E0E0', // Grey
    order: 50
  }
};

/**
 * Get section by ID
 */
export function getSection(sectionId) {
  return SECTIONS[sectionId];
}

/**
 * Get ordered array of all sections
 */
export function getAllSections() {
  return Object.values(SECTIONS)
    .sort((a, b) => (a.order || 999) - (b.order || 999));
}

export default SECTIONS;
