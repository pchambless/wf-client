import { columnMap } from './columns';

// Debug log the columnMap during module load
console.log('Loading ingredient config with columnMap:', {
  hasColumnMap: !!columnMap,
  keys: Object.keys(columnMap),
  ingrTypesStructure: columnMap.IngrTypes
});

export const pageConfig = {
    pageName: 'Ingredients',
    tabConfig: [
        {
            tab: 0,
            label: 'Ingredient Types',
            columnMap: columnMap.IngrTypes,
            listEvent: 'ingrTypeList',
            idField: 'ingrTypeID'  // Explicitly define primary key field
        },
        {
            tab: 1,
            label: 'Ingredients',
            columnMap: columnMap.Ingredients,
            listEvent: 'ingrList',
            idField: 'ingrID',      // Primary key for this tab
            parentIdField: 'ingrTypeID'  // Changed from parentID to parentIdField for consistency
        },
        {
            tab: 2,
            label: 'Batches',
            columnMap: columnMap.IngrBatches,
            listEvent: 'ingrBtchList',
            idField: 'ingrBtchID',  // Primary key for batches
            parentIdField: 'ingrID'  // Changed from parentID to parentIdField for consistency
        }
    ]
    // Removing the fetchOnTabActivation flag since we're standardizing on pre-loading
    // for the MVP version to maintain consistent behavior across the application
};

// Add console.log for debugging
console.log('Ingredient pageConfig:', pageConfig);

// Make sure each tab has required props
pageConfig.tabConfig.forEach((tab, i) => {
  // Check for missing columnMap or columns array
  if (!tab.columnMap || !tab.columnMap.columns) {
    console.error(`Tab ${i} (${tab.label}) is missing columnMap or columns array`);
  }
  
  // Check for missing listEvent
  if (!tab.listEvent) {
    console.error(`Tab ${i} (${tab.label}) is missing listEvent`);
  }
});
