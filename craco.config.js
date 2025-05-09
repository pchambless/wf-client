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
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@styles': path.resolve(__dirname, 'src/styles'),
    // App Components 
      '@layout': path.resolve(__dirname, 'src/components/1-page/a-layout'),
      '@navigation': path.resolve(__dirname, 'src/components/1-page/b-navigation'),
      '@crud': path.resolve(__dirname, 'src/components/1-page/c-crud'),
      '@appbar': path.resolve(__dirname, 'src/components/1-page/b-navigation/aa-AppBar'),
      '@sidebar': path.resolve(__dirname, 'src/components/1-page/b-navigation/bb-Sidebar'),
      '@pageheader': path.resolve(__dirname, 'src/components/1-page/b-navigation/cc-PageHeader'),
    // common components  
      '@form': path.resolve(__dirname, 'src/components/2-form'),
      '@common': path.resolve(__dirname, 'src/components/3-common'),
    // Page Utils
      '@pageMapBuild': path.resolve(__dirname, 'src/utils/pageMapBuild'),
    },
  },
};
