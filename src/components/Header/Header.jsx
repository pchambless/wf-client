// Add this button to your existing header component
import React, { useState } from 'react';
import { Button, Dialog, IconButton, Tooltip } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DocPortal from '../DocPortal/DocPortal';

// In your Header component:
const [docPortalOpen, setDocPortalOpen] = useState(false);

// Add this to your render method:
<Tooltip title="Documentation">
  <IconButton 
    color="inherit" 
    onClick={() => setDocPortalOpen(true)}
    sx={{ ml: 1 }}
  >
    <MenuBookIcon />
  </IconButton>
</Tooltip>

{/* Documentation Portal Dialog */}
<Dialog 
  open={docPortalOpen}
  onClose={() => setDocPortalOpen(false)}
  maxWidth="lg" 
  fullWidth
  sx={{ '& .MuiDialog-paper': { height: '90vh' } }}
>
  <DocPortal onClose={() => setDocPortalOpen(false)} />
</Dialog>
