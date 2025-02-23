import { useCallback, useRef } from 'react';

const useLogger = (componentName) => {
  const lastLogTime = useRef({});
  const prevComponent = useRef(null);

  return useCallback((message, ...args) => {
    const now = new Date();
    const timeString = now.toISOString();
    const ms = now.getMilliseconds().toString().padStart(3, '0');
    
    // Create a unique key for this log message and its arguments
    const logKey = `${componentName}-${message}-${JSON.stringify(args)}`;

    // Only log if it's been more than 1000ms since the last identical log
    if (!lastLogTime.current[logKey] || (now - lastLogTime.current[logKey]) > 1000) {
      const formattedTime = `${timeString.split('T')[1].replace('Z', '')}.${ms}`;
      
      // Format objects for better readability
      const formattedArgs = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
      );

      // Include previous component name if different from current component name
      const prevComponentName = prevComponent.current && prevComponent.current !== componentName
        ? ` (prev: ${prevComponent.current})`
        : '';

      console.log(`[${componentName}]${formattedTime} - ${message} from ${prevComponentName} `, ...formattedArgs);
      lastLogTime.current[logKey] = now;
      prevComponent.current = componentName;
    }
  }, [componentName]);
};

export default useLogger;
