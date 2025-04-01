import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Box, Button 
} from '@mui/material';
import tracker from '../../logger/tracker';
import { subscribe } from '../../utils/externalStore';
import { MetricsColumns } from './columns/metricsColumns';

const MetricsTable = () => {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const loadMetrics = () => {
      const currentMetrics = tracker.getMetrics();
      setMetrics(currentMetrics);
    };

    loadMetrics();
    const unsubscribe = subscribe(':actionMetrics', loadMetrics);
    return () => unsubscribe();
  }, []);

  const handleClearMetrics = () => {
    tracker.clearMetrics();
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
          variant="outlined" 
          size="small"
          onClick={handleClearMetrics}
        >
          Clear Metrics
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {MetricsColumns.columns.map(col => (
                <TableCell 
                  key={col.field}
                  align={col.align}
                  style={{ width: col.width }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {metrics.map(metric => (
              <TableRow key={`${metric.module}.${metric.function}`}>
                {MetricsColumns.columns.map(col => (
                  <TableCell 
                    key={col.field}
                    align={col.align}
                  >
                    {col.formatter 
                      ? col.formatter(metric[col.field])
                      : metric[col.field]
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default MetricsTable;
