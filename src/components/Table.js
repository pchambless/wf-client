import React, { useEffect, useState } from 'react';
import { useEventTypeContext } from '../context/EventTypeContext';
import useLogger from '../hooks/useLogger';

const Table = ({ listEvent, onRowClick }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const { execEvent } = useEventTypeContext(); // Changed from execEventType to execEvent
  const logAndTime = useLogger('Table: ');

  useEffect(() => {
    const fetchData = async () => {
      logAndTime(`Fetching data for listEvent: ${listEvent}`);
      try {
        const result = await execEvent(listEvent); // Changed from execEventType to execEvent
        logAndTime(`Data received:`, result);
        if (result && result.data && result.data.length > 0) {
          setData(result.data);
          setColumns(Object.keys(result.data[0]));
        } else {
          logAndTime('No data received or empty data array');
        }
      } catch (error) {
        logAndTime(`Error fetching data: ${error.message}`);
      }
    };

    fetchData();
  }, [listEvent, execEvent, logAndTime]);

  if (data.length === 0) {
    return <div>No data available.</div>;
  }

  // Render table here
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((column) => (
            <th
              key={column}
              scope="col"
              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} onClick={() => onRowClick(row)} className="cursor-pointer hover:bg-gray-100">
            {columns.map((column) => (
              <td key={`${rowIndex}-${column}`} className="px-6 py-4 whitespace-nowrap">
                {row[column]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
