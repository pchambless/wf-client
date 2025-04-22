import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Checkbox, FormControlLabel, List, ListItem, LinearProgress } from '@mui/material';

// Simple standalone GitHub issue downloader
const GitHubDownloader = () => {
  const [repo, setRepo] = useState('pchambless/wf-client');
  const [token, setToken] = useState('');
  const [issues, setIssues] = useState([]);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get token from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('github_pat');
    if (storedToken) setToken(storedToken);
  }, []);

  // Fetch issues from GitHub
  const fetchIssues = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const authToken = token;
      if (!authToken) {
        throw new Error('GitHub token is required');
      }
      
      const response = await fetch(`https://api.github.com/repos/${repo}/issues?state=all&per_page=100`, {
        headers: {
          'Authorization': `token ${authToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setIssues(data);
      console.log(`Loaded ${data.length} issues from GitHub`);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching issues:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch issue comments using GraphQL API
  const fetchComments = async (issueNumber) => {
    try {
      const authToken = token;
      const [owner, repo] = repo.split('/');
      
      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              repository(owner: "${owner}", name: "${repo}") {
                issue(number: ${issueNumber}) {
                  comments(first: 10) {
                    nodes {
                      body
                      createdAt
                      author { login }
                    }
                  }
                }
              }
            }
          `
        })
      });
      
      if (!response.ok) {
        throw new Error(`GraphQL request failed: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data?.repository?.issue?.comments?.nodes || [];
    } catch (err) {
      console.error(`Failed to fetch comments for issue #${issueNumber}:`, err);
      return [];
    }
  };

  // Format issue as Markdown
  const formatIssueAsMarkdown = (issue, comments = []) => {
    return `Issue #: ${issue.number}

Title: ${issue.title}

Body:

${issue.body || ''}

Comments:
${comments.map(comment => {
  const date = new Date(comment.createdAt).toISOString().split('T')[0];
  const author = comment.author?.login || 'Unknown';
  return `\n**Comment by ${author} on ${date}:**\n\n${comment.body}\n\n---\n`;
}).join('')}`;
  };

  // Download selected issues
  const downloadIssues = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const selectedIssues = issues.filter(issue => selected[issue.number]);
      if (selectedIssues.length === 0) {
        throw new Error('No issues selected');
      }
      
      console.log(`Downloading ${selectedIssues.length} issues...`);
      
      let successCount = 0;
      
      // Process each issue
      for (const issue of selectedIssues) {
        try {
          // Fetch comments
          const comments = await fetchComments(issue.number);
          
          // Format markdown
          const markdown = formatIssueAsMarkdown(issue, comments);
          
          // Generate filename
          const fileName = `req${issue.number} - ${issue.title.replace(/[^\w\s-]/g, '')}.md`;
          
          // Add filepath comment at the top
          const finalContent = `<!-- filepath: c:\\Users\\pc790\\whatsfresh\\Projects\\wf-client\\docs\\requirements\\${fileName} -->\n${markdown}`;
          
          // Create a downloadable file
          const blob = new Blob([finalContent], { type: 'text/markdown' });
          const url = URL.createObjectURL(blob);
          
          // Create download link and trigger download
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up the URL object
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          
          console.log(`Downloaded issue #${issue.number}`);
          successCount++;
        } catch (err) {
          console.error(`Error downloading issue #${issue.number}:`, err);
        }
      }
      
      alert(`Successfully downloaded ${successCount} issue files to your Downloads folder.`);
    } catch (err) {
      setError(err.message);
      console.error('Error downloading issues:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle selection for an issue
  const toggleIssue = (issueNumber) => {
    setSelected(prev => ({
      ...prev,
      [issueNumber]: !prev[issueNumber]
    }));
  };

  // Toggle select all
  const toggleAll = () => {
    const allSelected = issues.every(issue => selected[issue.number]);
    
    if (allSelected) {
      // Unselect all
      setSelected({});
    } else {
      // Select all
      const newSelected = {};
      issues.forEach(issue => {
        newSelected[issue.number] = true;
      });
      setSelected(newSelected);
    }
  };

  // Save token to localStorage
  const saveToken = () => {
    localStorage.setItem('github_pat', token);
    alert('Token saved successfully');
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Simple GitHub Issue Downloader</Typography>
      
      {error && (
        <Box mt={2} mb={2} p={1} bgcolor="error.light" color="error.main" borderRadius={1}>
          {error}
        </Box>
      )}
      
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Repository"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          fullWidth
          margin="normal"
        />
        
        <TextField
          label="GitHub Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          type="password"
          fullWidth
          margin="normal"
        />
        
        <Button onClick={saveToken} variant="outlined">
          Save Token
        </Button>
      </Box>
      
      <Box display="flex" gap={2} mb={2}>
        <Button onClick={fetchIssues} variant="contained" disabled={loading}>
          Fetch Issues
        </Button>
        
        <Button 
          onClick={downloadIssues} 
          variant="contained" 
          disabled={loading || selectedCount === 0}
          color="primary"
        >
          Download Selected ({selectedCount})
        </Button>
        
        {issues.length > 0 && (
          <FormControlLabel
            control={
              <Checkbox
                checked={issues.length > 0 && issues.every(issue => selected[issue.number])}
                indeterminate={selectedCount > 0 && selectedCount < issues.length}
                onChange={toggleAll}
              />
            }
            label={`Select All (${issues.length})`}
          />
        )}
      </Box>
      
      {loading && <LinearProgress />}
      
      {issues.length > 0 && (
        <List>
          {issues.map(issue => (
            <ListItem key={issue.number} divider>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={!!selected[issue.number]} 
                    onChange={() => toggleIssue(issue.number)}
                  />
                }
                label={`#${issue.number}: ${issue.title}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default GitHubDownloader;
