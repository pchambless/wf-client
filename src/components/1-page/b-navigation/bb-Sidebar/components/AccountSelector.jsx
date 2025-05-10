import React, { useState } from 'react';
import { Box, Typography, FormControl, Select, MenuItem, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePollVar } from '@utils/externalStoreDel';
import { setAccount } from '@utils/accountManager';
import createLogger from '@utils/logger';

const log = createLogger('AccountSelector');

const AccountSelector = ({ onClose }) => {
  const navigate = useNavigate();
  const accountList = usePollVar(':userAcctList', []);
  const currentAccount = usePollVar(':acctID');
  const [isLoading, setIsLoading] = useState(false);
  
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
  
  // Find current account name
  const currentAccountName = React.useMemo(() => {
    const account = accountList.find(a => Number(a.acctID) === Number(currentAccount));
    return account ? account.acctName : "Unknown Account";
  }, [accountList, currentAccount]);

  return (
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
            return currentAccountName;
          }}
        >
          {accountList.map(account => (
            <MenuItem key={account.acctID} value={account.acctID}>
              {account.acctName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default AccountSelector;
