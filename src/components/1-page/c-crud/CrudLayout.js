import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Table from './Table';
// Change this import to use the Form from the Form folder
import Form from './Form/Form'; // Updated path
import createLogger from '@utils/logger';
import MinViableProd from '@utils/MinViableProd';
import { SELECTION, triggerAction } from '@actions/actionStore';

class CrudLayoutPresenter extends MinViableProd {
  constructor(props) {
    super(props);
    this.state = {
      formMode: 'view',
      selectedRow: null
    };
    
    this.formRef = React.createRef();
    this.log = createLogger('CrudLayout');
    
    // Check if we have a pageMap and extract columnMap from it
    if (props.pageMap?.columnMap) {
      this.columnMap = props.pageMap.columnMap;
      this.pageConfig = props.pageMap.pageConfig;
    } else {
      // Fallback to direct props for backward compatibility
      this.columnMap = props.columnMap;
    }
    
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
    
    // Load data when component mounts
    this.loadData();
  }

  // Add method to load data from presenter or from listEvent directly
  loadData = async () => {
    const { pagePresenter, listEvent } = this.props;
    
    try {
      let data = [];
      
      // Try to get data from presenter first
      if (pagePresenter) {
        if (typeof pagePresenter.getTableData === 'function') {
          this.log.debug('Loading data via pagePresenter.getTableData()');
          data = await pagePresenter.getTableData();
        } else if (typeof pagePresenter.fetchData === 'function') {
          this.log.debug('Loading data via pagePresenter.fetchData()');
          data = await pagePresenter.fetchData(listEvent);
        }
      }
      
      // If presenter doesn't have data methods, use TablePresenter directly
      if (!data || !data.length) {
        const TablePresenter = await import('./Table/Presenter').then(m => m.default);
        this.log.debug('Loading data via TablePresenter');
        data = await TablePresenter.fetchData(listEvent);
      }
      
      this.setState({ tableData: data });
      this.log.debug('Data loaded successfully', { count: data.length });
    } catch (error) {
      this.log.error('Error loading data:', error);
    }
  };

  componentWillUnmount() {
    super.componentWillUnmount();
    this.mounted = false;
  }

  componentDidUpdate(prevProps) {
    // Load data when listEvent changes
    if (this.props.listEvent !== prevProps.listEvent) {
      this.loadData();
    }

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
        
        // Change to 'edit' instead of 'view'
        this.setState({
          formMode: 'edit',  // Changed from 'view' to 'edit'
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
    
    // Update local state - changed to 'edit' mode
    this.setState({
      formMode: 'edit',  // Changed from 'view' to 'edit'
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

  handleRowDoubleClick = (row) => {
    const { pageMap, navigate, addEntityCrumb } = this.props;
    const { pageConfig } = pageMap || {};
    
    if (pageConfig?.navigateTo && row[pageConfig.idField]) {
      // Replace parameters in the navigation path
      const path = pageConfig.navigateTo.replace(
        `:${pageConfig.idField}`, 
        row[pageConfig.idField]
      );
      
      // Add breadcrumb if needed
      if (pageConfig.entityType) {
        addEntityCrumb(
          row, 
          pageConfig.entityType, 
          path
        );
      }
      
      // Navigate to the configured path
      navigate(path);
    }
  }

  render() {
    const { pageMap, listEvent, pagePresenter } = this.props;
    const { pageConfig, columnMap } = pageMap || {};
    const { formMode, selectedRow, tableData } = this.state;

    const canAdd = true;
    
    // Debug what we're about to render
    this.log.info('Rendering CrudLayout:', {
      hasColumnMap: !!columnMap,
      listEvent,
      formMode,
      hasPagePresenter: !!pagePresenter,
      hasRowSelectionHandler: !!this.props.onRowSelection
    });
    
    // Check if we have the minimum required props
    if (!pageMap || !columnMap || !listEvent) {
      this.log.warn('Missing required props for render:', {
        hasPageMap: !!pageMap,
        hasColumnMap: !!columnMap,
        hasListEvent: !!listEvent
      });
      
      return (
        <Box p={2} border={1} borderColor="error.main">
          <Typography color="error">
            Missing configuration for current tab.
            {!pageMap && ' No pageMap provided.'}
            {pageMap && !columnMap && ' No columnMap defined in pageMap.'}
            {!listEvent && ' No listEvent provided.'}
          </Typography>
        </Box>
      );
    }

    // Add better error handling if columnMap is a function
    if (typeof this.props.columnMap === 'function') {
      this.log.error('ColumnMap was passed as a function instead of an object. Please call the function to get the actual column map.');
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
              tableConfig={{
                columns: typeof pagePresenter?.getColumns === 'function'
                  ? pagePresenter.getColumns(0)
                  : columnMap || [],
                idField: pageConfig?.idField || 'id',
                data: tableData || [],
                selectedId: selectedRow && selectedRow[pageConfig?.idField || 'id'],
                onRowClick: this.handleRowSelect,
                onRowDoubleClick: this.handleRowDoubleClick,
                onDelete: this.handleDelete
              }}
            />
          </Grid>
          
          <Grid item xs={5}>
            <Form 
              ref={this.formRef}
              pageMap={pageMap}  // Pass the whole pageMap
              formMode={this.state.formMode}
              formData={selectedRow}
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
  // Allow either pageMap OR columnMap
  pageMap: PropTypes.shape({
    columnMap: PropTypes.array,
    pageConfig: PropTypes.object
  }),
  columnMap: PropTypes.array,
  listEvent: PropTypes.string.isRequired,
  onRowSelection: PropTypes.func,
  pagePresenter: PropTypes.object,
  setActiveTab: PropTypes.func,
  updateTabStates: PropTypes.func
};

// Update the wrapper function to extract listEvent from columnMap if needed
const CrudLayout = (props) => {
  const { 
    pageMap, 
    listEvent: propListEvent,
    onRowSelection,
    presenter,
    setActiveTab,  
    updateTabStates
  } = props;
    
  const log = createLogger('CrudLayout');
  
  // Extract pageConfig
  const pageConfig = pageMap?.pageConfig;
  
  // Extract listEvent from pageConfig if not provided directly
  const listEvent = propListEvent || (pageConfig?.listEvent);
  
  log.debug('CrudLayout resolving listEvent', {
    providedDirectly: !!propListEvent,
    fromPageConfig: !!pageConfig?.listEvent,
    finalValue: listEvent
  });
  
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
      pageMap={pageMap}
      listEvent={listEvent}
      onRowSelection={handleRowSelect}
      pagePresenter={presenter}
      setActiveTab={setActiveTab}
      updateTabStates={updateTabStates}
    />
  );
};

export default CrudLayout;
