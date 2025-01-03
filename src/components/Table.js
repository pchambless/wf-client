import React from 'react';

const Table = ({ data, onRowClick }) => {
  if (!data || data.length === 0) {
    return <p>No data available.</p>;
  }

  const headers = Object.keys(data[0]);

  return (
    <table className="min-w-full mt-4 border-collapse">
      <thead>
        <tr>
          <th className="hidden">ID</th> {/* Hidden ID column */}
          {headers.map((header, index) => header !== 'id' && (
            <th key={index} className="px-4 py-2 border">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index} onClick={() => onRowClick(row)}>
            <td className="hidden">{row.id}</td> {/* Hidden ID column */}
            {headers.map((header) => header !== 'id' && (
              <td key={header} className="px-4 py-2 border">{row[header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
