import React from 'react';
import { Table as MuiTable, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const CrudTable = ({ data, columnMap, onRowClick, selectedRow }) => {
  return (
    <TableContainer component={Paper} style={{ maxHeight: '400px', overflow: 'auto' }}>
      <MuiTable size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {columnMap.filter(column => column.label && column.label !== 'Description' && column.label !== 'Comments' && !column.selList).map((column) => (
              <TableCell key={column.field} style={{ ...column.style, whiteSpace: column.type === 'DATE' ? 'nowrap' : 'normal' }} className={column.hidden ? 'hidden' : ''}>
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
              selected={selectedRow === row.id}
              style={{ cursor: 'pointer', backgroundColor: selectedRow === row.id ? '#e0e0e0' : 'inherit' }}
            >
              {columnMap.filter(column => column.label && column.label !== 'Comments' && column.label !== 'Description' && !column.selList).map((column) => (
                <TableCell key={`${row.id || index}-${column.field}`} style={{ ...column.style, whiteSpace: column.type === 'DATE' ? 'nowrap' : 'normal' }} className={column.hidden ? 'hidden' : ''}>
                  {row[column.field]}
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
