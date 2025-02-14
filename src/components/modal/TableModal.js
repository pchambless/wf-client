import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useModalContext } from '../../context/ModalContext';

const TableModal = ({ isOpen: propIsOpen, onRequestClose: propOnRequestClose, title: propTitle, content: propContent, onRowClick }) => {
  const { modalIsOpen: contextIsOpen, modalConfig, closeModal } = useModalContext();

  const isOpen = propIsOpen !== undefined ? propIsOpen : contextIsOpen;
  const onRequestClose = propOnRequestClose || closeModal;
  const title = propTitle || modalConfig.title;
  const content = propContent || modalConfig.content;

  if (!isOpen || (modalConfig.type !== 'table' && !propIsOpen)) {
    return null;
  }

  return (
    <Dialog open={isOpen} onClose={onRequestClose} aria-labelledby="table-dialog-title" maxWidth="md" fullWidth>
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
                <TableRow key={index} onClick={() => onRowClick && onRowClick(row)}>
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
        <Button onClick={onRequestClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TableModal;


