import { useEffect } from 'react';
import { usePageStore } from '../../stores';
import createLogger from '../../utils/logger';

const log = createLogger('TabbedCrumbs');

const TabbedCrumbs = ({ activeTab, tabLabels, selections }) => {
  const { updateHierarchy } = usePageStore();

  useEffect(() => {
    const values = [activeTab, ...tabLabels, ...Object.values(selections)].filter(Boolean);
    log.debug('Updating tabbed crumbs', { values });
    updateHierarchy(values);
    return () => updateHierarchy([]);
  }, [activeTab, tabLabels, selections, updateHierarchy]);

  return null;
};

export default TabbedCrumbs; // Export as default
