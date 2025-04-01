import createLogger from '../../utils/logger';
import { getRefDataByName } from '../../stores/accountStore';

const log = createLogger('HierPage');

export const initializeHierarchicalPage = (config) => {
  const firstLevel = config.hierarchy[0];
  const initialData = getRefDataByName(firstLevel.listEvent);

  log.debug('Initializing hierarchical page', {
    pageName: config.pageName,
    firstLevel: firstLevel.pageName,
    dataFound: !!initialData,
    count: initialData?.length
  });

  return {
    data: initialData || [],
    visibleTabs: firstLevel.tabClick
  };
};
