import React, { useState, useEffect } from 'react';
import { 
  Box, Button, Typography, LinearProgress, Alert, TextField, InputAdornment 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import IssueList from './IssueList';
import TokenInput from './TokenInput';
import { fetchIssues, fetchIssueWithComments } from './api';
import { formatIssueAsMarkdown, formatFileName } from './formatter';
import createLogger from '../../utils/logger';

const log = createLogger('IssueImporter');

// COMPLETELY REPLACE COMPONENT TO ENSURE NO SERVER CALL REMAINS
const IssueImporter = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIssues, setSelectedIssues] = useState({});
  const [search, setSearch] = useState('');
  const [repoPath, setRepoPath] = useState('pchambless/wf-client');
  const [token, setToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  
  // Get token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('github_pat');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  
  // Load issues when component mounts
  useEffect(() => {
    handleRefresh();
  }, []); 
  
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const fetchedIssues = await fetchIssues(repoPath, token);
      setIssues(fetchedIssues);
    } catch (err) {
      log.error('Error fetching issues:', err);
      setError(err.message);
      if (err.message.includes('token')) {
        setShowTokenInput(true);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveToken = () => {
    if (token) {
      localStorage.setItem('github_pat', token);
      setShowTokenInput(false);
      handleRefresh();
    } else {
      setError('Please enter a valid GitHub token');
    }
  };
  
  // NEW IMPLEMENTATION: PURELY CLIENT-SIDE
  const handleImport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const selectedIssuesList = issues.filter(issue => selectedIssues[issue.number]);
      if (selectedIssuesList.length === 0) {
        throw new Error('No issues selected');
      }
      
      log.info(`Processing ${selectedIssuesList.length} issues for direct download...`);
      
      // Process each issue sequentially to avoid browser download throttling
      let successCount = 0;
      for (const issue of selectedIssuesList) {
        try {
          // Fetch details with comments
          const issueWithComments = await fetchIssueWithComments(issue.number, repoPath, token);
          
          // Format content
          const markdown = formatIssueAsMarkdown(issue, issueWithComments);
          const fileName = formatFileName(issue);
          const finalContent = `<!-- filepath: c:\\Users\\pc790\\whatsfresh\\Projects\\wf-client\\docs\\requirements\\${fileName} -->\n${markdown}`;
          
          // Generate downloadable file directly in browser
          const blob = new Blob([finalContent], { type: 'text/markdown' });
          const url = URL.createObjectURL(blob);
          
          // Trigger download
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Cleanup URL object
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          
          log.info(`Downloaded file: ${fileName}`);
          successCount++;
        } catch (err) {
          log.error(`Failed to process issue #${issue.number}:`, err);
        }
      }
      
      log.info(`Successfully generated ${successCount} files`);
      alert(`Successfully downloaded ${successCount} issue files to your Downloads folder.`);
      
      // Clear selections
      setSelectedIssues({});
    } catch (err) {
      log.error('Error downloading issues:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Filter issues by search term
  const filteredIssues = issues.filter(issue => 
    issue.title.toLowerCase().includes(search.toLowerCase()) ||
    issue.number.toString().includes(search)
  );
  
  const numSelected = Object.values(selectedIssues).filter(Boolean).length;
  
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        GitHub Issues Importer
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TokenInput 
        show={showTokenInput}
        token={token}
        setToken={setToken}
        onSave={handleSaveToken}
        onManageToken={() => setShowTokenInput(true)}
        showManageButton={!showTokenInput && token}
      />
      
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          label="Repository"
          value={repoPath}
          onChange={(e) => setRepoPath(e.target.value)}
          size="small"
          sx={{ width: 300 }}
        />
        
        <TextField
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleImport}
          disabled={loading || numSelected === 0}
        >
          Download Selected ({numSelected})
        </Button>
      </Box>
      
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      
      <IssueList 
        issues={filteredIssues}
        selectedIssues={selectedIssues}
        onSelect={setSelectedIssues}
      />
    </Box>
  );
};

export default IssueImporter;
