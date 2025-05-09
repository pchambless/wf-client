import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useModalStore } from '../../../stores/modalStore';

const TableModal = () => {
  const { isOpen, config, closeModal } = useModalStore();

  const title = config.title;
  const content = config.content;

  if (!isOpen || config.type !== 'table') {
    return null;
  }

  return (
    <Dialog open={isOpen} onClose={closeModal} aria-labelledby="table-dialog-title" maxWidth="md" fullWidth>
      <DialogTitle id="table-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {content.columns.map((column) => (
                  <TableCell key={column.field}>{column.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {content.data.map((row, index) => (
                <TableRow key={index} onClick={() => config.onRowClick && config.onRowClick(row)}>
                  {content.columns.map((column) => (
                    <TableCell key={column.field}>{row[column.field]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TableModal;


