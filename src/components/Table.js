import React from 'react';
import '../styles/tailwind.css';

const Table = ({ data, onRowClick, onAddNewClick }) => {
  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  const headers = Object.keys(data[0]);

  return (
    <div className="max-w-full p-4 overflow-x-auto border rounded-lg border-product-brdr">
      <div className="flex justify-between mb-4">
        <button
          onClick={onAddNewClick}
          className="px-4 py-2 text-white rounded bg-primaryGreen hover:bg-secondaryRed"
        >
          Add New
        </button>
      </div>
      <div className="overflow-y-auto max-h-96"> {/* Max height for 25 rows */}
        <table className="min-w-full bg-white border-collapse table-auto">
          <thead>
            <tr>
              {headers.map((header, index) => (
                // Conditionally hide the "id" column
                header !== 'id' && (
                  <th
                    key={index}
                    className="px-4 py-2 text-left text-white border-b bg-primaryGreen"
                  >
                    {header}
                  </th>
                )
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 25).map((row, index) => ( // Display only up to 25 rows
              <tr
                key={index}
                className={`border-b ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                onClick={() => onRowClick(row)}
              >
                {headers.map((header) => (
                  // Conditionally hide the "id" column
                  header !== 'id' && (
                    <td key={header} className="px-3 py-1 border">{row[header]}</td> // Shorter row height
                  )
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
