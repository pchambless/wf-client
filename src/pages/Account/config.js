export const accountConfig = {
  type: 'TABBED',
  pageName: 'Account',
  path: '/account',
  label: 'Accounts',
  tabs: [
    {
      tab: 0,
      pageName: 'Vendors',
      label: 'Vendors',
      listEvent: 'vndrList',
      keyField: 'vndrID'
    },
    {
      tab: 1,
      pageName: 'Brands',
      label: 'Brands',
      listEvent: 'brndList',
      keyField: 'brndID'
    },
    {
      tab: 2,
      pageName: 'Workers',
      label: 'Workers',
      listEvent: 'wrkrList',
      keyField: 'wrkrID'
    }
  ]
};
