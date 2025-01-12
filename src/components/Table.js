import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useEventTypeContext } from '../context/EventTypeContext';
import useLogger from '../hooks/useLogger';

const Table = ({ listEvent, onRowClick, columnMapping = {}, idField, labelField }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetchedData = useRef(false); // Flag to control data fetching
  const { execEvent } = useEventTypeContext();
  const logAndTime = useLogger('Table');

  const fetchData = useCallback(async () => {
    if (hasFetchedData.current) {
      return; // Prevent repeated fetching
    }

    setLoading(true);
    logAndTime(`Fetching data for listEvent: ${listEvent}`);
    try {
      const result = await execEvent(listEvent);
      logAndTime(`Data received:`, result, `length: ${result.length}`);
      if (result && result.length > 0) {
        setData(result);
        setColumns(Object.keys(result[0]));
        logAndTime(`Columns set: ${Object.keys(result[0])}`);
        hasFetchedData.current = true; // Set the flag to true after successful fetch
      } else {
        logAndTime('No data received or empty data array');
        setData([]);
        setColumns([]);
      }
    } catch (error) {
      logAndTime(`Error fetching data: ${error.message}`);
      setData([]);
      setColumns([]);
    } finally {
      setLoading(false);
    }
  }, [listEvent, execEvent, logAndTime]);

  useEffect(() => {
    if (listEvent) {
      fetchData();
    }
  }, [listEvent, fetchData]);

  const handleRowClick = useCallback((row) => {
    if (onRowClick) {
      const acctID = row[idField];
      const acctName = row[labelField];
      onRowClick({ acctID, acctName });
    }
  }, [onRowClick, idField, labelField]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (data.length === 0) {
    return <div>No data available.</div>;
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column, index) => (
            <th
              key={column}
              scope="col"
              className={`px-6 py-1 text-xs font-medium tracking-wider text-left text-gray-500 uppercase ${index === 0 ? 'hidden' : ''}`} // Hide the first column header
            >
              {columnMapping[column] || column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} onClick={() => handleRowClick(row)} className="text-sm cursor-pointer hover:bg-gray-100"> {/* Shrink the row text size */}
            {columns.map((column, colIndex) => (
              <td key={`${rowIndex}-${column}`} className={`px-6 py-1 whitespace-nowrap ${colIndex === 0 ? 'hidden' : ''}`}> {/* Hide the first column data */}
                {row[column]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default React.memo(Table);
