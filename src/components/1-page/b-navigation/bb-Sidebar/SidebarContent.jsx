import React, { useEffect, useMemo, useState } from 'react';
import { 
  Box, 
  Typography, 
  FormControl, 
  Select, 
  MenuItem,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SidebarNav from '@sidebar/SidebarNav';
import { usePollVar } from '@utils/externalStoreDel';
import createLogger from '@utils/logger';
import { setAccount } from '@utils/accountManager';

const log = createLogger('SidebarContent');

const SidebarContent = ({ onClose }) => {
  const navigate = useNavigate();
  
  // Get the raw data with explicit debug logging
  const accountList = usePollVar(':userAcctList', []);
  const currentAccount = usePollVar(':acctID');
  const [isLoading, setIsLoading] = useState(false);
  
  // Add immediate debug logging to see what's happening
  useEffect(() => {
    log.debug('Account data:', {
      currentAccount,
      typeOfCurrentAccount: typeof currentAccount,
      accountList: accountList.slice(0, 3), // Log first 3 accounts to avoid log spam
      accountListLength: accountList?.length || 0
    });
  }, [currentAccount, accountList]);
  
  // Create memoized derived values
  const currentAccountDisplay = useMemo(() => {
    // Check if currentAccount exists and is not null
    if (currentAccount === null || currentAccount === undefined) {
      return "Select Account";
    }
    
    // Find matching account with explicit type conversion
    const account = accountList.find(a => 
      String(a.acctID) === String(currentAccount)
    );
    
    return account ? account.acctName : "Unknown Account";
  }, [accountList, currentAccount]);
  
  const handleAccountChange = async (event) => {
    const newAccountId = event.target.value;
    setIsLoading(true);
    
    try {
      const success = await setAccount(newAccountId);
      if (success) {
        navigate('/welcome', { replace: true });
        if (onClose) onClose();
      }
    } catch (error) {
      log.error('Error switching accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
      {/* Account Selector Section */}
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
          ACCOUNT
        </Typography>
        
        <FormControl fullWidth size="small">
          <Select
            value={currentAccount || ''}
            onChange={handleAccountChange}
            sx={{ bgcolor: 'background.paper' }}
            displayEmpty
            disabled={isLoading}
            renderValue={() => {
              if (isLoading) {
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Switching...
                  </Box>
                );
              }
              
              return currentAccountDisplay;
            }}
          >
            {accountList.map(account => (
              <MenuItem 
                key={account.acctID} 
                value={account.acctID}
              >
                {account.acctName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {/* Sidebar Nav */}
      <SidebarNav onClose={onClose} />
    </Box>
  );
};

export default SidebarContent;
