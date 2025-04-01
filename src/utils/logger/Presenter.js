import { LOG_LEVELS } from './types';
import { addToSequence } from './actions';

export class Presenter {
  static instances = new Map();
  static DEBUG_COMPONENTS = ['API', 'EventStore', 'ExternalStore'];

  constructor(componentName) {
    this.componentName = componentName;
    this.metrics = {
      created: new Date(),
      lastCall: null,
      calls: 0,
      level: Presenter.DEBUG_COMPONENTS.includes(componentName) ? 
        LOG_LEVELS.DEBUG : LOG_LEVELS.INFO
    };
    Presenter.instances.set(componentName, this);
  }

  updateMetrics(level, args) {
    this.metrics.calls++;
    this.metrics.lastCall = new Date();
    
    addToSequence({
      time: new Date().toLocaleTimeString(),
      component: this.componentName,
      level: Object.keys(LOG_LEVELS).find(k => LOG_LEVELS[k] === level),
      message: args.join(' ')
    });
    
    window.dispatchEvent(new Event('logUpdate'));
  }

  info(...args) {
    if (this.metrics.level >= LOG_LEVELS.INFO) {
      this.updateMetrics(LOG_LEVELS.INFO, args);
      console.info(`[${this.componentName}]`, ...args);
    }
  }

  debug(...args) {
    if (this.metrics.level >= LOG_LEVELS.DEBUG) {
      this.updateMetrics(LOG_LEVELS.DEBUG, args);
      console.debug(`[${this.componentName}]`, ...args);
    }
  }

  warn(...args) {
    if (this.metrics.level >= LOG_LEVELS.WARN) {
      this.updateMetrics(LOG_LEVELS.WARN, args);
      console.warn(`[${this.componentName}]`, ...args);
    }
  }

  error(...args) {
    this.updateMetrics(LOG_LEVELS.ERROR, args);
    console.error(`[${this.componentName}]`, ...args);
  }

  static getMetricsMap() {
    return new Map(Array.from(this.instances.entries())
      .map(([name, instance]) => [name, instance.metrics]));
  }
}
