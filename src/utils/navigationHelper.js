import createLogger from './logger';

const log = createLogger('NavigationHelper');

// Use dynamic imports instead of static ones
const getRoutes = async () => {
  try {
    // Dynamic imports break the circular dependency
    const [dashboard, ingredients, products, account] = await Promise.all([
      import('../routes/dashboard').then(m => m.dashboardRoutes),
      import('../routes/ingredients').then(m => m.ingredientRoutes),
      import('../routes/products').then(m => m.productRoutes),
      import('../routes/account').then(m => m.accountRoutes)
    ]);
    
    return [...dashboard, ...ingredients, ...products, ...account];
  } catch (error) {
    log.error('Failed to load routes:', error);
    return [];
  }
};

/**
 * Get navigation menu items by category, with async loading of routes
 */
export const getNavigationItems = async (category) => {
  const allRoutes = await getRoutes();
  
  return allRoutes.filter(route => 
    route.navigation?.category === category && 
    route.navigation?.showInMenu === true
  ).sort((a, b) => 
    (a.navigation?.order || 99) - (b.navigation?.order || 99)
  );
};

/**
 * Generate navigation links - with async handling
 */
export const getNavigationLinks = async (category) => {
  const items = await getNavigationItems(category);
  
  return items.map(item => ({
    path: item.path,
    label: item.label,
    icon: item.navigation?.icon
  }));
};
