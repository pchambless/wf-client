import React, { useEffect, useState, useCallback, useRef } from 'react';
import ReactModal from 'react-modal';
import { useEventTypeContext } from '../../context/EventTypeContext';
import useLogger from '../../hooks/useLogger';
import { setPrfxVars } from '../../utils/externalStore';

ReactModal.setAppElement('#root');

const Table = ({ 
  listEvent, 
  columnMapping, 
  onRowClick, 
  prfxVarsMapping, 
  onAddNewClick, 
  columnStyles,
  hiddenColumns = [] // Add hiddenColumns prop with default empty array
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetchedData = useRef(false);
  const { execEvent } = useEventTypeContext();
  const logAndTime = useLogger('Table');

  const fetchData = useCallback(async () => {
    if (!listEvent) return;
    try {
      setLoading(true);
      const result = await execEvent(listEvent);
      setData(result);
    } catch (err) {
      setError(err.message);
      logAndTime('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [listEvent, execEvent, logAndTime]);

  useEffect(() => {
    if (!hasFetchedData.current) {
      fetchData();
      hasFetchedData.current = true;
    }
  }, [listEvent, fetchData]);

  const handleRowClick = useCallback((row) => {
    logAndTime('Row clicked:', row);
    logAndTime('prfxVarsMapping:', prfxVarsMapping);

    if (prfxVarsMapping) {
      const prfxVars = {};
      Object.entries(prfxVarsMapping).forEach(([key, value]) => {
        prfxVars[key] = row[value];
      });
      setPrfxVars('', prfxVars);
      logAndTime('setPrfxVars called with:', prfxVars);
    }

    if (onRowClick) {
      onRowClick(row);
    }
  }, [prfxVarsMapping, onRowClick, logAndTime]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error}</div>;
  }

  if (data.length === 0) {
    return <div>No data available.</div>;
  }

  // Filter out hidden columns
  const visibleColumns = Object.entries(columnMapping).filter(
    ([key]) => !hiddenColumns.includes(key)
  );
  return (
    <div className="overflow-x-auto">
      {onAddNewClick && (
        <button
          onClick={onAddNewClick}
          className="px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Add New
        </button>
      )}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {visibleColumns.map(([key, config]) => (
              <th 
                key={key} 
                className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                style={columnStyles && columnStyles[key]}
              >
                {config.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              onClick={() => handleRowClick(row)} 
              className="transition-colors duration-150 ease-in-out cursor-pointer hover:bg-gray-100"
            >
              {visibleColumns.map(([key, config]) => (
                <td 
                  key={key} 
                  className="px-3 py-2 text-sm text-gray-500 whitespace-nowrap"
                  style={columnStyles && columnStyles[key]}
                >
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(Table);
