import createLogger from '../../utils/logger';

const log = createLogger('TabbedPage');

export const initializeTabbedPage = (config) => {
  log.debug('Initializing tabbed page', {
    pageName: config.pageName,
    tabCount: config.tabs.length
  });

  return {
    visibleTabs: config.tabs.map(tab => tab.visible)
  };
};
