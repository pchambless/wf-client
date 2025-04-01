import { LOG_LEVELS } from './types';
import { Presenter } from './Presenter';
import { 
  startUserAction, 
  getLastActionSequence 
} from './actions';

export {
  LOG_LEVELS,
  startUserAction,
  getLastActionSequence
};

export const createLogger = (componentName) => {
  if (!Presenter.instances.has(componentName)) {
    new Presenter(componentName);
  }
  return Presenter.instances.get(componentName);
};

export const getLoggerTableData = () => Presenter.getMetricsMap();
