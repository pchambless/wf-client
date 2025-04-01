import { setVar } from '../../../utils/externalStore';
import createLogger from '../../../utils/logger';
import { execEvent } from '../../../stores/eventStore';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import tracker from '../../../logger/tracker';

export class TablePresenter {
  constructor(columnMap, listEvent) {
    this.log = createLogger('Table.Presenter');
    this.columnMap = columnMap;
    this.listEvent = listEvent;

    // Wrap methods with tracking
    this.fetchData = tracker.wrapFunction(this.fetchData.bind(this));
    this.handleRowClick = tracker.wrapFunction(this.handleRowClick.bind(this));
  }

  async fetchData() {
    try {
      this.log.debug('Fetching data:', { listEvent: this.listEvent });
      const result = await execEvent(this.listEvent);
      return result;
    } catch (error) {
      this.log.error('Failed to fetch data:', error);
      throw error;
    }
  }

  getIdField() {
    const idColumn = this.columnMap.columns.find(col => col.where === 1);
    if (!idColumn) {
      this.log.warn('No ID column found (where: 1)');
      return null;
    }
    return idColumn.field;
  }

  getColumns(onDelete) {
    if (!this.columnMap?.columns) return [];

    let columns = this.columnMap.columns
      .map(col => ({
        ...col,
        hide: this.shouldHideInTable(col),
        // Set fixed width for DATE fields
        width: col.dataType === 'DATE' ? 100 : (col.width || 100)
      }))
      .filter(col => !col.hide)
      .map(col => ({
        field: col.field,
        headerName: col.label,
        width: col.width,
        ...col
      }));

    // Add delete column if handler provided
    if (onDelete) {
      columns.unshift({
        field: 'delete',
        headerName: '',
        width: 50,
        hide: false,
        renderCell: (params) => (
          <IconButton onClick={() => onDelete(params.row)}>
            <DeleteIcon />
          </IconButton>
        )
      });
    }

    this.log.debug('Table columns:', {
      total: this.columnMap.columns.length,
      visible: columns.length,
      hidden: this.columnMap.columns.filter(c => this.shouldHideInTable(c)).length,
      columns: columns.map(c => ({ 
        field: c.field, 
        hidden: c.hide,
        width: c.width,
        type: c.dataType
      }))
    });

    return columns;
  }

  shouldHideInTable(col) {
    // Hide if any of these conditions are true
    return (
      col.group <= 0 ||           // System/hidden fields
      col.selList ||              // Selection list fields
      col.multiline ||            // Multiline text fields
      col.hide === true           // Explicitly hidden
    );
  }

  handleRowClick(row, onRowSelect) {
    this.log.debug('Row clicked:', row);
    if (!row) return;
    
    // Set form mode first
    setVar(':formMode', 'edit');
    
    // Set vars for form fields
    this.columnMap?.columns?.forEach(col => {
      if (col.setVar) {
        setVar(col.setVar, row[col.field]);
        this.log.debug('Setting var:', {
          var: col.setVar,
          value: row[col.field]
        });
      }
    });

    // Then notify parent
    onRowSelect?.(row);
    return row;
  }
}
