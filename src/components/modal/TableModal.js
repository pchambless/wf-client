import React, { useState, useEffect, useCallback } from 'react';
import ReactModal from 'react-modal';
import useLogger from '../../hooks/useLogger';
import { useEventTypeContext } from '../../context/EventTypeContext';

const TableModal = ({ 
  isOpen, 
  onRequestClose, 
  title, 
  content,
  onRowClick: externalOnRowClick
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { execEvent } = useEventTypeContext();
  const log = useLogger('TableModal');

  const visibleColumns = content?.columns
    ? content.columns.filter(col => !content.hiddenColumns?.includes(col))
    : [];

  const fetchData = useCallback(async () => {
    if (!content || !content.listEvent) {
      log('No listEvent provided in content');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      log(`Fetching data with listEvent: ${content.listEvent}`);
      const result = await execEvent(content.listEvent);
      log('Data fetched:', result);
      if (Array.isArray(result)) {
        setData(result);
        log(`Data set with ${result.length} items`);
      } else {
        log('Fetched data is not an array:', result);
        setData([]);
      }
    } catch (err) {
      setError(err.message);
      log('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [content, execEvent, log]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, fetchData]);

  const handleRowClick = useCallback((row) => {
    if (externalOnRowClick) {
      externalOnRowClick(row);
    }
  }, [externalOnRowClick]);

  log('Rendering TableModal', { 
    isOpen, 
    loading, 
    error, 
    dataLength: data.length, 
    visibleColumnsLength: visibleColumns.length,
    content: content
  });

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={title}
      className="modal"
      overlayClassName="overlay"
    >
      <h2>{title}</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error fetching data: {error}</div>
      ) : data.length === 0 ? (
        <div>No data available.</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {visibleColumns.map((col) => (
                <th 
                  key={col}
                  scope="col" 
                  className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  {content.columnLabels[col] || col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr 
                key={index} 
                onClick={() => handleRowClick(row)}
                className="cursor-pointer hover:bg-gray-100"
              >
                {visibleColumns.map((col) => (
                  <td 
                    key={col} 
                    className="px-3 py-2 text-sm text-gray-500 whitespace-nowrap"
                  >
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </ReactModal>
  );
};

export default TableModal;
