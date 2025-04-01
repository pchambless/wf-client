export const dashboardConfig = {
  // Layout configuration
  layout: {
    title: 'Dashboard',
    description: 'Overview of your What\'s Fresh activities'
  },
  
  // Widget configurations
  widgets: {
    recentActivity: {
      title: 'Recent Activity',
      maxItems: 5
    },
    stats: {
      title: 'Quick Stats',
      refreshInterval: 300000 // 5 minutes
    },
    inventory: {
      title: 'Inventory Status',
      warningThreshold: 20 // Percentage
    }
  }
};
