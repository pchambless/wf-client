const path = require('path');

module.exports = {
  webpack: {
    alias: {
      // Top Level Folders
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@actions': path.resolve(__dirname, 'src/actions'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@stores': path.resolve(__dirname, 'src/stores'),
      '@pages': path.resolve(__dirname, 'src/pages'), // Now points to new pages folder
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@config': path.resolve(__dirname, 'src/config'), // New config alias
      
      // App Components 
      '@layout': path.resolve(__dirname, 'src/components/1-page/a-layout'),
      '@navigation': path.resolve(__dirname, 'src/components/1-page/b-navigation'),
      '@crud': path.resolve(__dirname, 'src/components/1-page/c-crud'),
      '@appbar': path.resolve(__dirname, 'src/components/1-page/b-navigation/aa-AppBar'),
      '@sidebar': path.resolve(__dirname, 'src/components/1-page/b-navigation/bb-Sidebar'),
      '@pageheader': path.resolve(__dirname, 'src/components/1-page/b-navigation/cc-PageHeader'),
      
      // Common components  
      '@form': path.resolve(__dirname, 'src/components/2-form'),
      '@table': path.resolve(__dirname, 'src/components/2-form/a-table'),
      '@common': path.resolve(__dirname, 'src/components/3-common'),
      '@modal': path.resolve(__dirname, 'src/components/3-common/a-modal'),
      
      // Routes 
      '@route': path.resolve(__dirname, 'src/routes'),

      // Page Components - Updated to new location
      '@login': path.resolve(__dirname, 'src/pages/0-Login'),
      '@dashboard': path.resolve(__dirname, 'src/pages/1-Dashboard'),
      '@ingredient': path.resolve(__dirname, 'src/pages/2-Ingredient'),
      '@product': path.resolve(__dirname, 'src/pages/3-Product'),
      '@account': path.resolve(__dirname, 'src/pages/4-Account'),
      '@mapping': path.resolve(__dirname, 'src/pages/5-Mapping'),
      
      // Hooks
      '@entityHooks': path.resolve(__dirname, 'src/hooks/1-entity'),
      '@formHooks': path.resolve(__dirname, 'src/hooks/2-form'),
      
      // Services
      '@entityServices': path.resolve(__dirname, 'src/services/1-entity'),
      '@apiServices': path.resolve(__dirname, 'src/services/2-api'),
      
      // Page Utils
      '@pageMapBuild': path.resolve(__dirname, 'src/utils/pageMapBuild'),
    },
  },
};
