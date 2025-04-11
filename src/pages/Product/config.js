import { columnMap } from './columns';

export const pageConfig = {
  pageName: 'Products',
  tabConfig: [
    {
      tab: 0,
      label: 'Product Types',
      columnMap: columnMap.ProdTypes,
      listEvent: 'prodTypeList',
      idField: 'prodTypeID'
    },
    {
      tab: 1,
      label: 'Products',
      columnMap: columnMap.Products,
      listEvent: 'prodList',
      idField: 'prodID',
      parentIdField: 'prodTypeID'
    },
    {
      tab: 2,
      label: 'Batches',
      columnMap: columnMap.ProdBatches,
      listEvent: 'prodBtchList',
      idField: 'prodBtchID',
      parentIdField: 'prodID'
    }
  ]
};

// Add console.log for debugging
console.log('Product pageConfig:', pageConfig);

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

