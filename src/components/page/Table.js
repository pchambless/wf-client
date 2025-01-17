import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useEventTypeContext } from '../../context/EventTypeContext';
import useLogger from '../../hooks/useLogger';
import { setVars } from '../../utils/externalStore';

const Table = ({ pageConfig, onRowClick, onAddNewClick }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetchedData = useRef(false);
  const { execEvent } = useEventTypeContext();
  const log = useLogger('Table');

  log('Table component initialized with pageConfig:', pageConfig);

  const {
    listEvent,
    columns = [],
  } = pageConfig.table || {};

  log('listEvent:', listEvent);
  log('columns:', columns);

  const fetchData = useCallback(async () => {
    if (!listEvent) {
      log('No listEvent provided, skipping data fetch');
      return;
    }
    try {
      log('Fetching data...');
      setLoading(true);
      const result = await execEvent(listEvent);
      log('Data fetched:', result);
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      log('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [listEvent, execEvent, log]);

  useEffect(() => {
    log('useEffect triggered');
    if (!hasFetchedData.current) {
      log('Initiating data fetch');
      fetchData();
      hasFetchedData.current = true;
    }
  }, [fetchData, log]);

  const handleRowClick = useCallback((row) => {
    log('Row clicked:', row);

    columns.forEach(column => {
      if (column.setVar) {
        setVars({ [column.setVar]: row[column.field] });
      }
    });

    if (onRowClick) {
      onRowClick(row);
    }
  }, [columns, onRowClick, log]);

  if (loading) {
    log('Rendering loading state');
    return <div>Loading...</div>;
  }

  if (error) {
    log('Rendering error state:', error);
    return <div>Error fetching data: {error}</div>;
  }

  if (!data || data.length === 0) {
    log('Rendering empty data state');
    return <div>No data available.</div>;
  }

  log('Rendering table with data:', data);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border-2 border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {columns.map((column) => (
              <th 
                key={column.field} 
                className={`px-4 py-2 text-xs font-bold tracking-wider text-left text-gray-700 uppercase border-b-2 border-gray-300 ${column.hidden ? 'hidden' : ''}`}
                style={column.style}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr 
              key={row.id || index} 
              onClick={() => handleRowClick(row)} 
              className={`cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
            >
              {columns.map((column) => (
                <td 
                  key={`${row.id || index}-${column.field}`} 
                  className={`px-4 py-2 border-b border-gray-200 whitespace-nowrap ${column.hidden ? 'hidden' : ''}`}
                  style={column.style}
                >
                  {row[column.field]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {onAddNewClick && (
        <button onClick={onAddNewClick} className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600">
          Add New
        </button>
      )}
    </div>
  );
};

export default React.memo(Table);
