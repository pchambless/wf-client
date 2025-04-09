import React, { useMemo } from 'react';
import TabbedPage from '../types/tabbedPage';
import { accountConfig } from './config';
import createLogger from '../../utils/logger';

const log = createLogger('Account');

const Account = () => {
  // Simple presenter for the Account page
  const presenter = useMemo(() => {
    return {
      getListEvent: (tabIndex) => {
        const tab = accountConfig.tabs[tabIndex];
        return tab.listEvent;
      }
    };
  }, []);
  
  return (
    <TabbedPage
      tabConfiguration={accountConfig.tabs}
      presenter={presenter}
      pageTitle="Account Information"
      // Non-hierarchical tabs don't need initialSelections or isolatedLayouts
    />
  );
};

export default Account;
