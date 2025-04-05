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
            listEvent: 'ingrTypeList'
        },
        {
            label: 'Ingredients',
            columnMap: columnMap.Ingredients,
            listEvent: 'ingrList'
        },
        {
            label: 'Batches',
            columnMap: columnMap.IngrBatches,
            listEvent: 'ingrBtchList'
        }
    ]
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
