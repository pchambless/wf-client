import React, { useMemo } from 'react';
import JustTabs from '../types/justTabs'; // Changed to new consistent filename
import { accountConfig } from './config';
import createLogger from '../../utils/logger';

const Account = () => {
  const log = useMemo(() => createLogger('AccountPage'), []);

  // Simple presenter for the Account page
  const presenter = useMemo(() => {
    return {
      getListEvent: (tabIndex) => {
        const tab = accountConfig.tabs[tabIndex];
        log.debug(`Getting list event for account tab ${tabIndex}`, {
          event: tab.listEvent?.name || tab.listEvent
        });
        return tab.listEvent;
      }
    };
  }, [log]);
  
  return (
    <JustTabs
      tabConfig={accountConfig.tabs}
      presenter={presenter}
      pageTitle="Account Information"
      isolatedLayouts={true} // Each tab has its own independent data
    />
  );
};

export default Account;
