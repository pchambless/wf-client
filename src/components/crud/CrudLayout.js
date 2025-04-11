import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Table from './Table';
// Change this import to use the Form from the Form folder
import Form from './Form/Form'; // Updated path
import createLogger from '../../utils/logger';
import MinViableProd from '../../utils/MinViableProd';
import { SELECTION, triggerAction } from '../../actions/actionStore';

class CrudLayoutPresenter extends MinViableProd {
  constructor(props) {
    super(props);
    this.state = {
      formMode: 'view',
      selectedRow: null
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

  componentDidUpdate(prevProps) {
    // More robust handling of tab/columnMap changes
    if (this.props.columnMap !== prevProps.columnMap || 
        this.props.activeTabIndex !== prevProps.activeTabIndex) {
      
      this.log.debug('Tab content changed - updating form', {
        columnMapChanged: this.props.columnMap !== prevProps.columnMap,
        tabIndexChanged: this.props.activeTabIndex !== prevProps.activeTabIndex,
        newTabIndex: this.props.activeTabIndex
      });
      
      // Reset form state
      this.setState({
        formMode: 'view',
        selectedRow: null
      }, () => {
        // Force form refresh with new columnMap
        if (this.formRef.current) {
          if (typeof this.formRef.current.refresh === 'function') {
            this.formRef.current.refresh();
          } else if (typeof this.formRef.current.setFormData === 'function') {
            // Alternative approach if refresh isn't available
            this.formRef.current.setFormData({});
          }
          
          // Log the form component for debugging
          this.log.debug('Form component after tab change:', {
            formRef: !!this.formRef.current,
            formRefType: typeof this.formRef.current,
            methods: this.formRef.current ? Object.keys(this.formRef.current) : []
          });
        }
      });
    }
  }

  handleRowSelect = (row) => {
    if (!row) {
      this.log.warn('No row data provided');
      return;
    }
    
    this.log.debug('Processing UI updates for row selection');
    
    // Create context for CrudLayout concerns only
    const crudContext = {
      setFormData: (formData) => {
        this.log.debug('Setting form data from row selection', {
          hasFormData: !!formData,
          formDataKeys: formData ? Object.keys(formData) : []
        });
        
        this.setState({
          formMode: 'view',
          selectedRow: formData
        }, () => {
          if (this.formRef.current) {
            this.formRef.current.refresh();
          }
        });
      },
      __source: 'CrudLayout',
      __scope: 'crudLayout'
    };
    
    // IMPROVED: Trigger action with CrudLayout context FIRST before changing state
    triggerAction(SELECTION.ROW_SELECT, {
      row,
      source: 'table'
    }, crudContext);
    
    // Update local state
    this.setState({
      formMode: 'view',
      selectedRow: row
    }, () => {
      // Refresh the form with the selected data
      if (this.formRef.current) {
        this.formRef.current.refresh();
      }
      
      // Also pass to callback for direct handling by hierarchy
      if (this.props.onRowSelection) {
        this.props.onRowSelection(row);
      }
    });
  };

  handleAddNew = () => {
    this.log.debug('Add New clicked');
    this.clearFormFields();
    this.props.onRowSelection?.(null);
    this.setState({ formMode: 'add' }, () => {
      // Add safety check before calling refresh
      if (this.formRef.current && typeof this.formRef.current.refresh === 'function') {
        this.formRef.current.refresh('add');
      } else {
        this.log.warn('Unable to refresh form for add mode', {
          hasFormRef: !!this.formRef.current
        });
      }
    });
  };

  render() {
    // Update to pass the page presenter to Table
    const { columnMap, listEvent, pagePresenter, onRowSelection } = this.props;
    const { formMode, selectedRow } = this.state;
    const canAdd = true;
    
    // Debug what we're about to render
    this.log.debug('Rendering CrudLayout:', {
      hasColumnMap: !!columnMap,
      listEvent,
      formMode,
      hasPagePresenter: !!pagePresenter,
      hasRowSelectionHandler: !!onRowSelection
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
              onRowSelect={columnMap.onRowSelect}
              selectedId={selectedRow?.id}
              presenter={pagePresenter}
              setActiveTab={this.props.setActiveTab}
              updateTabStates={this.props.updateTabStates}
              onRowSelection={this.props.onRowSelection}
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
    selectedRow: null
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
  onRowSelection: PropTypes.func,
  pagePresenter: PropTypes.object,
  setActiveTab: PropTypes.func,
  updateTabStates: PropTypes.func
};

// Fix this wrapper function with minimal changes
const CrudLayout = (props) => {
  const { 
    columnMap, 
    listEvent, 
    onRowSelection,
    presenter,
    setActiveTab,  
    updateTabStates
  } = props;
    
  const log = createLogger('CrudLayout');
  
  log.debug('CrudLayout presenter check:', {
    hasPresenter: !!presenter,
    presenterType: presenter?.constructor?.name || 'unknown',
    hasHandleRowSelection: typeof presenter?.handleRowSelection === 'function'
  });

  const handleRowSelect = (row) => {
    log.debug('CrudLayout passing row selection to hierTabs', {
      hasRowSelection: !!onRowSelection,
      hasRow: !!row 
    });
    if (onRowSelection && row) {
      onRowSelection(row);
    }
  };

  return (
    <CrudLayoutPresenter
      columnMap={columnMap}
      listEvent={listEvent}
      onRowSelection={handleRowSelect}
      pagePresenter={presenter}
      setActiveTab={setActiveTab}
      updateTabStates={updateTabStates}
    />
  );
};

export default CrudLayout;
