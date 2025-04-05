import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Table from './Table';
import Form from './Form';
import createLogger from '../../utils/logger';
import MinViableProd from '../../utils/MinViableProd';

class CrudLayoutPresenter extends MinViableProd {
  constructor(props) {
    super(props);
    this.state = {
      formMode: 'view',
      selectedRow: null // Add this line
    };
    
    this.formRef = React.createRef();
    this.log = createLogger('CrudLayout');
    
    // Debug the props
    this.log.debug('CrudLayout initialized with props:', {
      hasColumnMap: !!props.columnMap,
      columnCount: props.columnMap?.columns?.length,
      listEvent: props.listEvent
    });
  }

  componentDidMount() {
    super.componentDidMount();
    this.mounted = true;
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.mounted = false;
  }

  handleRowSelect = (row) => {
    if (!row) {
      this.log.warn('No row data provided');
      return;
    }
    
    this.log.debug('Processing UI updates for row selection');
    
    this.setState({
      formMode: 'view',
      selectedRow: row // Add this line
    }, () => {
      if (this.formRef.current) {
        this.formRef.current.refresh();
      }
      
      // Call the callback if provided (for backward compatibility)
      if (this.props.onRowSelection) {
        this.props.onRowSelection(row);
      } else {
        this.log.debug('No onRowSelection prop provided - using action system only');
        // All row selection handling should now happen through action subscribers
      }
    });
  };

  handleAddNew = () => {
    this.log.debug('Add New clicked');
    this.clearFormFields();
    this.props.onRowSelection?.(null);
    this.setState({ formMode: 'add' });
    this.formRef.current?.refresh('add');
  };

  render() {
    const { columnMap, listEvent } = this.props;
    const { formMode, selectedRow } = this.state; // Add selectedRow here
    const canAdd = true;
    
    // Debug what we're about to render
    this.log.debug('Rendering CrudLayout:', {
      hasColumnMap: !!columnMap,
      listEvent,
      formMode
    });
    
    // Check if we have the minimum required props
    if (!columnMap || !columnMap.columns || !listEvent) {
      this.log.warn('Missing required props for render:', {
        hasColumnMap: !!columnMap,
        hasColumns: columnMap?.columns?.length > 0,
        hasListEvent: !!listEvent
      });
      
      return (
        <Box p={2} border={1} borderColor="error.main">
          <Typography color="error">
            Missing configuration for current tab.
            {!columnMap && ' No columnMap provided.'}
            {columnMap && !columnMap.columns && ' No columns configured.'}
            {!listEvent && ' No listEvent provided.'}
          </Typography>
        </Box>
      );
    }

    return (
      <Box display="flex" flexDirection="column" gap={2}>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
              {canAdd && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={this.handleAddNew}
                >
                  Add New
                </Button>
              )}
            </Box>
            
            <Table 
              columnMap={columnMap}
              listEvent={listEvent}
              onRowClick={this.handleRowSelect}
              onRowSelect={columnMap.onRowSelect} // Add this line
              selectedId={selectedRow?.id}
            />
          </Grid>
          
          <Grid item xs={5}>
            <Form 
              ref={this.formRef}
              columnMap={columnMap}
              formMode={formMode}
            />
          </Grid>
        </Grid>
      </Box>
    );
  }

  static initialState = {
    formMode: 'view',
    selectedRow: null // Add this line
  };

  static trackedMethods = [
    'handleRowSelect',
    'handleAddNew',
    'clearFormFields'
  ];
}

CrudLayoutPresenter.propTypes = {
  columnMap: PropTypes.object.isRequired,
  listEvent: PropTypes.string.isRequired,
  onRowSelection: PropTypes.func // Remove .isRequired to make it optional
};

// Change this wrapper function:
const CrudLayout = (props) => {
  // Remove the check for pageConfig since we don't pass it anymore
  return <CrudLayoutPresenter {...props} />;
};

export default CrudLayout;
