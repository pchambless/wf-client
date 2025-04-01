import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { TablePresenter } from './Presenter';
import createLogger from '../../../utils/logger';

const Table = ({ columnMap, listEvent, onRowSelect, selectedId }) => {
  const log = useMemo(() => createLogger('Table'), []);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const presenter = useMemo(() => 
    new TablePresenter(columnMap, listEvent), 
    [columnMap, listEvent]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await presenter.fetchData();
        setRows(data);
      } catch (error) {
        log.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [presenter, log]);

  const handleRowClick = (params) => {
    const processedRow = presenter.handleRowClick(params.row);
    onRowSelect?.(processedRow);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={presenter.getColumns()}
        getRowId={(row) => row[presenter.getIdField()]}
        onRowClick={handleRowClick}
        loading={loading}
        disableColumnFilter
        disableColumnMenu
        hideFooter
        autoHeight={false}
        density="compact"
        getRowClassName={(params) => 
          params.row[presenter.getIdField()] === selectedId ? 'Mui-selected' : ''
        }
      />
    </Box>
  );
};

export default Table;
