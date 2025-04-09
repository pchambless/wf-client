import { columnMap } from './columns';

// Debug log the columnMap during module load
console.log('Loading ingredient config with columnMap:', {
  hasColumnMap: !!columnMap,
  keys: Object.keys(columnMap),
  ingrTypesStructure: columnMap.IngrTypes
});

export const pageConfig = {
    pageName: 'Ingredients',
    tabConfiguration: [
        {
            label: 'Ingredient Types',
            columnMap: columnMap.IngrTypes,
            listEvent: 'ingrTypeList',
            idField: 'ingrTypeID'  // Explicitly define primary key field
        },
        {
            label: 'Ingredients',
            columnMap: columnMap.Ingredients,
            listEvent: 'ingrList',
            idField: 'ingrID',      // Primary key for this tab
            parentID: 'ingrTypeID'  // Renamed from parentField for clarity
        },
        {
            label: 'Batches',
            columnMap: columnMap.IngrBatches,
            listEvent: 'ingrBtchList',
            idField: 'ingrBtchID',  // Primary key for batches
            parentID: 'ingrID'      // Link to parent ingredient
        }
    ]
    // Removing the fetchOnTabActivation flag since we're standardizing on pre-loading
    // for the MVP version to maintain consistent behavior across the application
};

// Add console.log for debugging
console.log('Ingredient pageConfig:', pageConfig);

// Make sure each tab has required props
pageConfig.tabConfiguration.forEach((tab, i) => {
  // Check for missing columnMap or columns array
  if (!tab.columnMap || !tab.columnMap.columns) {
    console.error(`Tab ${i} (${tab.label}) is missing columnMap or columns array`);
  }
  
  // Check for missing listEvent
  if (!tab.listEvent) {
    console.error(`Tab ${i} (${tab.label}) is missing listEvent`);
  }
});
