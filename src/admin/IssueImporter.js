import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, Button, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Checkbox, Paper,
  LinearProgress, Alert, TextField, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import createLogger from '../utils/logger';

const log = createLogger('IssueImporter');
const GITHUB_API_BASE = 'https://api.github.com';

const IssueImporter = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIssues, setSelectedIssues] = useState({});
  const [search, setSearch] = useState('');
  const [repoPath, setRepoPath] = useState('pchambless/wf-client'); // Set your default repo
  const [token, setToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  
  // Get token from localStorage as fallback if env variable is not available
  useEffect(() => {
    const storedToken = localStorage.getItem('github_pat');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  
  // Memoize fetchIssues to avoid dependency array issues
  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // First try env variable, then fall back to state variable that might have been loaded from localStorage
      const authToken = process.env.REACT_APP_GITHUB_PAT || token;
      
      if (!authToken) {
        setShowTokenInput(true);
        throw new Error('GitHub token not found. Please enter your token below.');
      }
      
      const response = await fetch(`${GITHUB_API_BASE}/repos/${repoPath}/issues?state=all&per_page=100`, {
        headers: {
          'Authorization': `token ${authToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      log.info(`Loaded ${data.length} issues from GitHub`);
      setIssues(data);
    } catch (err) {
      log.error('Error fetching issues:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [repoPath, token]); // Add token as dependency
  
  // Save token to localStorage
  const handleSaveToken = () => {
    if (token) {
      localStorage.setItem('github_pat', token);
      setShowTokenInput(false);
      fetchIssues(); // Retry fetching issues with the new token
    } else {
      setError('Please enter a valid GitHub token');
    }
  };
  
  // Load issues when component mounts
  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]); // Add fetchIssues as a dependency
  
  const handleToggleSelect = (issueId) => {
    setSelectedIssues(prev => ({
      ...prev,
      [issueId]: !prev[issueId]
    }));
  };
  
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = {};
      filteredIssues.forEach(issue => {
        newSelected[issue.number] = true;
      });
      setSelectedIssues(newSelected);
    } else {
      setSelectedIssues({});
    }
  };
  
  // Add a new function to fetch issue details with comments using GraphQL
  const fetchIssueWithComments = async (issueNumber) => {
    const authToken = process.env.REACT_APP_GITHUB_PAT || token;
    const [owner, repo] = repoPath.split('/');
    
    // GraphQL query to get issue details with comments
    const graphqlQuery = {
      query: `
        query {
          repository(owner: "${owner}", name: "${repo}") {
            issue(number: ${issueNumber}) {
              number
              title
              body
              createdAt
              updatedAt
              comments(first: 10) {
                nodes {
                  body
                  createdAt
                  author {
                    login
                  }
                }
              }
            }
          }
        }
      `
    };
    
    // Make the GraphQL request
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery)
    });
    
    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data.repository.issue;
  };
  
  // Add a function to format issue content as Markdown
  const formatIssueAsMarkdown = (issue, enhancedData) => {
    try {
      // Get basic issue data
      const issueNumber = issue.number;
      // Remove the unused title variable
      // const title = issue.title;
      const body = enhancedData?.body || issue.body || '';
      
      // Format comments if available
      let commentsMarkdown = '';
      if (enhancedData?.comments?.nodes?.length > 0) {
        // Sort comments by date (newest first)
        const sortedComments = [...enhancedData.comments.nodes]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        commentsMarkdown = sortedComments.map(comment => {
          const date = new Date(comment.createdAt).toISOString().split('T')[0];
          const author = comment.author?.login || 'Unknown';
          return `**Comment by ${author} on ${date}:**\n\n${comment.body}\n\n`;
        }).join('---\n\n');
      }
      
      // Format the complete markdown file
      const markdown = `Issue #: ${issueNumber}

Body:

${body}

Comments:
${commentsMarkdown}`;

      log.debug('Generated markdown for issue #' + issueNumber);
      return markdown;
    } catch (error) {
      log.error('Error formatting issue as markdown:', error);
      return `Issue #: ${issue.number}\n\nError formatting issue content.`;
    }
  };
  
  // When formatting file names 
  const formatFileName = (issue) => {
    const issueNumber = issue.number;
    const title = issue.title.trim();
    const sanitizedTitle = title.replace(/[^\w\s-]/g, '');
    return `req${issueNumber} - ${sanitizedTitle}.md`;
  };

  const importSelectedIssues = async () => {
    setLoading(true);
    setError(null);
    try {
      const selectedIssuesList = issues.filter(issue => selectedIssues[issue.number]);
      if (selectedIssuesList.length === 0) {
        throw new Error('No issues selected');
      }
      
      log.info(`Importing ${selectedIssuesList.length} issues...`);
      
      // Enhance selected issues with comments using GraphQL API
      const enhancedIssues = [];
      for (const issue of selectedIssuesList) {
        try {
          log.debug(`Fetching comments for issue #${issue.number}`);
          const issueWithComments = await fetchIssueWithComments(issue.number);
          
          // Format the markdown content
          const markdown = formatIssueAsMarkdown(issue, issueWithComments);
          
          // Merge the issue data with the comments data and markdown
          enhancedIssues.push({
            ...issue,
            enhancedData: issueWithComments,
            markdownContent: markdown,
            fileName: formatFileName(issue)
          });
        } catch (err) {
          log.warn(`Failed to fetch comments for issue #${issue.number}:`, err);
          // Still include the issue without comments
          enhancedIssues.push(issue);
        }
      }
      
      // Call your backend endpoint to save issues to files
      const response = await fetch('/api/admin/importIssues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ issues: enhancedIssues })
      });
      
      if (!response.ok) {
        throw new Error(`Import failed: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      log.info('Issues imported successfully:', result);
      alert(`Successfully imported ${result.count} issues`);
      
      // Clear selections
      setSelectedIssues({});
    } catch (err) {
      log.error('Error importing issues:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredIssues = issues.filter(issue => 
    issue.title.toLowerCase().includes(search.toLowerCase()) ||
    issue.number.toString().includes(search)
  );
  
  const isAllSelected = filteredIssues.length > 0 && 
    filteredIssues.every(issue => selectedIssues[issue.number]);
  
  const numSelected = Object.values(selectedIssues).filter(Boolean).length;
  
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        GitHub Issues Importer
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      
      {/* Add token input UI */}
      {showTokenInput && (
        <Box sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            GitHub Personal Access Token
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              label="PAT Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              size="small"
              type="password"
              fullWidth
              helperText="This token will be stored in your browser's local storage"
            />
            <Button 
              variant="contained" 
              onClick={handleSaveToken}
              disabled={!token}
            >
              Save Token
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Create a token with 'repo' scope at https://github.com/settings/tokens
          </Typography>
        </Box>
      )}
      
      {/* Show a button to manage token if already saved */}
      {!showTokenInput && token && (
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="text" 
            onClick={() => setShowTokenInput(true)}
            size="small"
          >
            Manage GitHub Token
          </Button>
        </Box>
      )}
      
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
          onClick={fetchIssues}
          disabled={loading}
        >
          Refresh
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={importSelectedIssues}
          disabled={loading || numSelected === 0}
        >
          Import Selected ({numSelected})
        </Button>
      </Box>
      
      {loading && <LinearProgress sx={{ mb: 2 }} />}
      
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ py: 0.5 }}>
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < filteredIssues.length}
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ py: 0.5 }}>Issue #</TableCell>
              <TableCell sx={{ py: 0.5 }}>Title</TableCell>
              <TableCell sx={{ py: 0.5 }}>State</TableCell>
              <TableCell sx={{ py: 0.5 }}>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredIssues.map(issue => (
              <TableRow 
                key={issue.number}
                hover
                onClick={() => handleToggleSelect(issue.number)}
                selected={!!selectedIssues[issue.number]}
                sx={{ height: 38 }} // Decreased row height
              >
                <TableCell padding="checkbox" sx={{ py: 0.5 }}>
                  <Checkbox 
                    checked={!!selectedIssues[issue.number]}
                    onChange={() => handleToggleSelect(issue.number)}
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>{issue.number}</TableCell>
                <TableCell sx={{ py: 0.5 }}>{issue.title}</TableCell>
                <TableCell sx={{ py: 0.5 }}>
                  <Box
                    sx={{
                      display: 'inline-block',
                      px: 0.8,
                      py: 0.2, // Reduced padding
                      borderRadius: 1,
                      bgcolor: issue.state === 'open' ? 'success.light' : 'grey.400',
                      color: 'white',
                      fontSize: '0.75rem' // Smaller font size
                    }}
                  >
                    {issue.state}
                  </Box>
                </TableCell>
                <TableCell sx={{ py: 0.5 }}>{new Date(issue.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {filteredIssues.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No issues found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default IssueImporter;
