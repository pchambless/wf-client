import { columnMap } from './columns';

export const pageConfig = {
  pageName: 'Products',
  tabConfiguration: [
    {
      label: 'Product Types',
      columnMap: columnMap.ProdTypes,
      listEvent: 'prodTypeList'
    },
    {
      label: 'Products',
      columnMap: columnMap.Products,
      listEvent: 'prodList'
    },
    {
      label: 'Batches',
      columnMap: columnMap.ProdBatches,
      listEvent: 'prodBtchList'
    }
  ]
};

