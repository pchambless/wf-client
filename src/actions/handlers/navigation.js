import createLogger from '../../utils/logger';
import { setPageTitle, setBreadcrumbs } from '../../stores/pageStore';

const log = createLogger('ActionHandlers.Navigation');

/**
 * Navigation action handlers
 */
const navigationHandlers = {
  PAGE_SELECT: {
    description: "Handle page navigation",
    payload: {
      path: "Route path",
      pageName: "Name of the page",
      label: "Display label for the page"
    },
    handlers: [
      {
        name: "Update breadcrumbs",
        code: `setBreadcrumbs([
          { label: 'Home', path: '/' },
          { label: payload.label, path: payload.path }
        ])`,
        implementation: (payload) => {
          if (payload.path && payload.label) {
            log.info(`Updating breadcrumbs for: ${payload.label}`);
            setBreadcrumbs([
              { label: 'Home', path: '/' },
              { label: payload.label, path: payload.path }
            ]);
          }
        }
      },
      {
        name: "Update page title",
        code: `setPageTitle(payload.label)`,
        implementation: (payload) => {
          if (payload.label) {
            log.info(`Setting page title to: ${payload.label}`);
            setPageTitle(payload.label);
          }
        }
      },
      {
        name: "Track navigation for analytics",
        implementation: (payload) => {
          log.info(`Page navigation: ${payload.path}`, { 
            timestamp: payload.timestamp,
            pageName: payload.pageName
          });
        }
      }
    ]
  },
  
  TAB_SELECT: {
    description: "Handle tab selection",
    payload: {
      tabIndex: "Index of the selected tab",
      tabId: "ID of the tab",
      tabLabel: "Display label of the tab"
    },
    handlers: [
      {
        name: "Update tab-specific title",
        implementation: (payload) => {
          if (payload.tabLabel) {
            const title = `${payload.tabLabel}`;
            log.debug(`Updating document title for tab: ${title}`);
            document.title = title;
          }
        }
      }
    ]
  }
};

export default navigationHandlers;
