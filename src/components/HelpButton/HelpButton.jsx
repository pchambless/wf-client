import React, { useState } from 'react';
import { IconButton, Tooltip, Dialog, Box, Typography, Button, CircularProgress } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import MarkdownRenderer from '../DocPortal/MarkdownRenderer';
import { fetchOnboardingHelp } from '../DocPortal/docService';

const HelpButton = ({ area }) => {
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpContent, setHelpContent] = useState('');
  const [helpTitle, setHelpTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpenHelp = async () => {
    setHelpOpen(true);
    setLoading(true);
    
    try {
      const helpData = await fetchOnboardingHelp(area);
      setHelpContent(helpData.content);
      setHelpTitle(helpData.title);
    } catch (error) {
      setHelpContent(`# Error Loading Help\n\n${error.message}`);
      setHelpTitle('Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Help">
        <IconButton onClick={handleOpenHelp} color="primary">
          <HelpIcon />
        </IconButton>
      </Tooltip>
      
      <Dialog 
        open={helpOpen} 
        onClose={() => setHelpOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">{helpTitle}</Typography>
            <Button onClick={() => setHelpOpen(false)} variant="outlined">Close</Button>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <MarkdownRenderer markdown={helpContent} />
          )}
        </Box>
      </Dialog>
    </>
  );
};

export default HelpButton;
