import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useEventTypeContext } from '../context/EventTypeContext';


const Table = ({ listEvent, columnMapping = {}, idField, labelField, onRowClick }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state
  const hasFetchedData = useRef(false);
  const { execEvent } = useEventTypeContext();
  const fileName = 'Table ';

  const fetchData = useCallback(async () => {
    if (hasFetchedData.current || error) { // Check if already fetched or if there was an error
      return;
    }

    setLoading(true);
    console.log(`[${fileName}] Fetching data for listEvent: ${listEvent}`);
    try {
      const result = await execEvent(listEvent);
      console.log(`[${fileName}] Data received:`, result, `length: ${result.length}`);
      if (result && result.length > 0) {
        setData(result);
        setColumns(Object.keys(result[0]));
        console.log(`[${fileName}] Columns set: ${Object.keys(result[0])}`);
        hasFetchedData.current = true; // Prevents infinite loop by setting flag
      } else {
        console.log(`[${fileName}]No data received or empty data array`);
        setData([]);
        setColumns([]);
      }
    } catch (error) {
      console.log(`[${fileName}] Error fetching data: ${error.message}`);
      setError(error); // Set error state
      setData([]);
      setColumns([]);
    } finally {
      setLoading(false);
    }
  }, [listEvent, execEvent, error]);

  useEffect(() => {
    if (listEvent) {
      fetchData();
    }
  }, [listEvent, fetchData]);

  const handleRowClick = useCallback((row) => {
    const acctID = row[idField];
    const acctName = row[labelField];
    console.log(`[${fileName}] Row clicked`, { acctID, acctName });
    if (onRowClick) {
      onRowClick(acctID, acctName); // Use onRowClick to handle data and closing
    }
  }, [idField, labelField, onRowClick]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>; // Display error message
  }

  if (data.length === 0) {
    return <div>No data available.</div>;
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column, index) => (
            columnMapping[column]?.visible !== false && (
              <th
                key={column}
                scope="col"
                className={`px-6 py-1 text-xs font-medium tracking-wider text-left text-gray-500 uppercase ${index === 0 ? 'hidden' : ''}`}
              >
                {columnMapping[column]?.label || column}
              </th>
            )
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} onClick={() => handleRowClick(row)} className="text-sm cursor-pointer hover:bg-gray-100">
            {columns.map((column, colIndex) => (
              columnMapping[column]?.visible !== false && (
                <td key={`${rowIndex}-${column}`} className={`px-6 py-1 whitespace-nowrap ${colIndex === 0 ? 'hidden' : ''}`}>
                  {row[column]}
                </td>
              )
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default React.memo(Table);
