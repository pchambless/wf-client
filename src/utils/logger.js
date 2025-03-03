const createLogger = (componentName) => {
  const lastLogTime = {};

  return (message, ...args) => {
    const now = new Date();
    const timeString = now.toISOString();
    const ms = now.getMilliseconds().toString().padStart(3, '0');

    // Create a unique key for this log message and its arguments
    const logKey = `${componentName}-${message}-${JSON.stringify(args)}`;

    // Only log if it's been more than 1000ms since the last identical log
    if (!lastLogTime[logKey] || (now - lastLogTime[logKey]) > 1000) {
      const formattedTime = `${timeString.split('T')[1].replace('Z', '')}.${ms}`;

      // Format objects for better readability
      const formattedArgs = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
      );

      console.log(`[${componentName}] ${formattedTime} - ${message}`, ...formattedArgs);
      lastLogTime[logKey] = now;
    }
  };
};

export default createLogger;


