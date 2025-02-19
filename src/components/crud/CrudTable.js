import React from 'react';
import { Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// import Select from '../page/Select'; // Import the Select component

const CrudTable = ({ data, columnMap, onRowClick, selectedRow, selectOptions }) => {
  const getDisplayValue = (field, value) => {
    const options = selectOptions[field] || [];
    const option = options.find(option => option.id === value);
    return option ? option.name : 'None';
  };

  return (
    <TableContainer component={Paper} style={{ maxHeight: '400px', overflow: 'auto' }}>
      <MuiTable size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {columnMap.filter(column => column.label).map((column) => (
              <TableCell key={column.field} style={column.style} className={column.hidden ? 'hidden' : ''}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={row.id || index}
              onClick={() => onRowClick(row)}
              className="cursor-pointer"
              selected={selectedRow === row.id}
              style={{ cursor: 'pointer' }}
            >
              {columnMap.filter(column => column.label).map((column) => (
                <TableCell key={`${row.id || index}-${column.field}`} style={column.style} className={column.hidden ? 'hidden' : ''}>
                  {column.selList ? (
                    getDisplayValue(column.field, row[column.field])
                  ) : (
                    row[column.field]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default CrudTable;