import React from 'react';
import { 
  Box, 
  Typography, 
  FormControl, 
  Select, 
  MenuItem,
  Divider
} from '@mui/material';
import SidebarNav from './SidebarNav';
import { usePollVar, setVars } from '../../utils/externalStore';
import { useNavigate } from 'react-router-dom';
import { initAccountStore } from '../../stores';
import createLogger from '../../utils/logger';

const log = createLogger('SidebarContent');

const SidebarContent = ({ onClose }) => {
  const navigate = useNavigate();
  const accountList = usePollVar(':userAcctList', []);
  const currentAccount = usePollVar(':acctID');
  
  const handleAccountChange = async (event) => {
    const newAccountId = event.target.value;
    log.info('Switching account', { from: currentAccount, to: newAccountId });
    
    try {
      setVars(':acctID', newAccountId);
      
      log.debug('Initializing data for new account');
      await initAccountStore();
      
      // Redirect to welcome page
      navigate('/welcome', { replace: true });
      
      // Close sidebar on mobile if needed
      if (onClose) onClose();
    } catch (error) {
      log.error('Error switching accounts:', error);
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
      
      <Divider />
      
      {/* Navigation Section */}
      <Box sx={{ p: 2, pb: 0 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
          NAVIGATION
        </Typography>
      </Box>
      
      <SidebarNav onNavigate={onClose} />
      
      {/* User info at bottom */}
      <Box sx={{ mt: 'auto', p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="body2">
          User: {usePollVar(':userEmail', '')}
        </Typography>
      </Box>
    </Box>
  );
};

export default SidebarContent;
