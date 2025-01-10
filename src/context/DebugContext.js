import React, { createContext, useContext, useState, useCallback } from 'react';

const DebugContext = createContext();

export const useDebug = () => useContext(DebugContext);

export const DebugProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);

  const addLog = useCallback((source, message, data = null) => {
    const timestamp = new Date().toISOString();
    setLogs(prevLogs => {
      const existingLogIndex = prevLogs.findIndex(
        log => log.source === source && log.message === message
      );

      if (existingLogIndex !== -1) {
        // Update existing log
        const updatedLogs = [...prevLogs];
        updatedLogs[existingLogIndex] = {
          ...updatedLogs[existingLogIndex],
          timestamp,
          data
        };
        return updatedLogs;
      } else {
        // Add new log
        return [...prevLogs, { timestamp, source, message, data }];
      }
    });
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <DebugContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </DebugContext.Provider>
  );
};
