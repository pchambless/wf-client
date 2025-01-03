const useLogger = (fileName) => {
  const logAndTime = (message, data = null) => {
    const time = new Date().toISOString();
    console.log(`[${fileName}] ${time} - ${message}`);
    if (data) {
      console.log(data);
    }
  };
  return logAndTime;
};

export default useLogger;
