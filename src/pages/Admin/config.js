import { columnMap } from './columns';

export const pageConfig = {
  pageName: 'Admin',
  tabConfiguration: [
    {
      label: 'Accounts',
      columnMap: columnMap.accounts,
      listEvent: 'accountList'
    },
    {
      label: 'Users',
      columnMap: columnMap.users,
      listEvent: 'userList'
    },
    {
      label: 'Measure Units',
      columnMap: columnMap.measUnits,
      listEvent: 'measList'
    }
  ]
};

export default pageConfig;
