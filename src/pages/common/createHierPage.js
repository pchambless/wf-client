import React, { useState, useEffect, useRef, useMemo } from 'react';
import HierTabs from './hierTabs';
import createLogger from '../../utils/logger';

/**
 * Higher-order component factory for hierarchical pages
 */
const createHierPage = ({
  pageName,
  pageConfig,
  PresenterClass,
  initialSelections,
  contextualNavigation = [],
  isolatedLayouts = false,
  customizePresenter = null
}) => {
  // Create the page component
  const HierPage = ({ navigate }) => {
    // CRITICAL FIX: Use useMemo for stable logger to avoid re-renders
    const log = useMemo(() => createLogger(`${pageName}Page`), []);
    
    // CRITICAL FIX: Create stable refs outside of effects
    const presenterRef = useRef(null);
    const initializedRef = useRef(false); // Use ref instead of state for initialization tracking
    
    // CRITICAL FIX: Use state only for forcing re-render after initialization
    const [isReady, setIsReady] = useState(false);
    
    // Initialize presenter ONCE on mount only
    useEffect(() => {
      const operationId = `init-presenter-${Date.now()}`;
      
      // Only initialize if needed
      if (!initializedRef.current) {
        log.group(operationId, 'Initializing Presenter');
        log.info('Creating presenter instance');
        
        // Create a new presenter only once
        const basePresenter = new PresenterClass();
        presenterRef.current = basePresenter;
        
        // Apply customizations if needed
        if (customizePresenter && typeof customizePresenter === 'function') {
          try {
            customizePresenter(basePresenter, log, navigate);
            log.debug('Presenter customizations applied');
          } catch (err) {
            log.error('Error customizing presenter:', err);
          }
        }
        
        // Mark as initialized
        initializedRef.current = true;
        setIsReady(true);
        
        log.debug('Presenter initialization complete');
        log.groupEnd(operationId);
      }
      
      // Cleanup function
      return () => {
        if (presenterRef.current) {
          log.info(`${pageName} page unmounting, destroying presenter`);
          try {
            presenterRef.current.destroy();
          } catch (err) {
            log.error('Error destroying presenter:', err);
          }
          presenterRef.current = null;
          initializedRef.current = false;
        }
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array - intentionally run only once on mount
    
    // Wait until presenter is initialized
    if (!isReady || !presenterRef.current) {
      return <div>Loading {pageName} page...</div>;
    }
    
    // Render the HierTabs component with our presenter
    return (
      <HierTabs
        tabConfig={pageConfig.tabConfig}
        presenter={presenterRef.current}
        pageTitle={pageName}
        isolatedLayouts={isolatedLayouts}
        initialSelections={initialSelections}
        contextualNavigation={contextualNavigation}
      />
    );
  };
  
  return HierPage;
};

export default createHierPage;
