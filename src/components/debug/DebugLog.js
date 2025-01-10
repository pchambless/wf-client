import React from 'react';
import { useDebug } from '../../context/DebugContext';

const DebugLog = () => {
  const { logs, clearLogs } = useDebug();

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Debug Log</h2>
        <button 
          onClick={clearLogs}
          className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Clear Logs
        </button>
      </div>
      <div className="p-4 overflow-y-auto bg-gray-100 rounded max-h-96">
        {logs.map((log, index) => (
          <div key={index} className="pb-2 mb-2 border-b border-gray-300">
            <span className="font-semibold">[{log.source}]</span> {log.timestamp} - {log.message}
            {log.data && (
              <pre className="p-2 mt-1 text-sm bg-gray-200 rounded">
                {JSON.stringify(log.data, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};


export default DebugLog;
