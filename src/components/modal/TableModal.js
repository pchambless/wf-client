import React, { useEffect, useMemo } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import useLogger from '../../hooks/useLogger';
import { useModalContext } from '../../context/ModalContext';

const TableModal = ({ isOpen: propIsOpen, onRequestClose: propOnRequestClose, title: propTitle, content: propContent, onRowClick }) => {
  const { modalIsOpen: contextIsOpen, modalConfig, closeModal } = useModalContext();
  const log = useLogger('TableModal');

  const isOpen = propIsOpen !== undefined ? propIsOpen : contextIsOpen;
  const onRequestClose = propOnRequestClose || closeModal;
  const title = propTitle || modalConfig.title;
  const content = propContent || modalConfig.content;

  useEffect(() => {
    if (isOpen) {
      log.debug('Table modal opened', {
        title,
        hasData: !!content?.data,
        rowCount: content?.data?.length,
        columnCount: content?.columns?.length,
        hasRowClickHandler: !!onRowClick
      });
    }
  }, [isOpen, title, content, onRowClick, log]);

  const handleClose = () => {
    log.debug('Closing table modal');
    onRequestClose();
  };

  const handleRowClick = (row) => {
    log.debug('Table row clicked', {
      rowData: row,
      title
    });
    if (onRowClick) {
      onRowClick(row);
    }
  };

  const columns = useMemo(() => {
    if (!content?.columns) {
      log.warn('No columns defined for table modal', { title });
      return [];
    }
    return content.columns;
  }, [content?.columns, title, log]);

  const data = useMemo(() => {
    if (!content?.data) {
      log.warn('No data provided for table modal', { title });
      return [];
    }
    return content.data;
  }, [content?.data, title, log]);

  if (!isOpen || (modalConfig.type !== 'table' && !propIsOpen)) {
    return null;
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="table-modal-title" maxWidth="md" fullWidth>
      <DialogTitle id="table-modal-title">{title}</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell key={index}>{column.header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  onClick={() => handleRowClick(row)}
                  hover={!!onRowClick}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {row[column.field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TableModal;


