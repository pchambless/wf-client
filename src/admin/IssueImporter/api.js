import createLogger from '../../utils/logger';

const log = createLogger('IssueImporter.API');
const GITHUB_API_BASE = 'https://api.github.com';

// Use the dedicated GitHub API base URL if available
const GITHUB_API_SERVER = process.env.REACT_APP_GITHUB_API_BASE_URL || 'http://localhost:3002';

export const fetchIssues = async (repoPath, token) => {
  const authToken = process.env.REACT_APP_GITHUB_PAT || token;
  
  if (!authToken) {
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
  return data;
};

export const fetchIssueWithComments = async (issueNumber, repoPath, token) => {
  const authToken = process.env.REACT_APP_GITHUB_PAT || token;
  const [owner, repo] = repoPath.split('/');
  
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

// Replace the importIssues function with a completely new implementation
// that doesn't try to use the client-side implementation AND make a server request
export const importIssues = async (enhancedIssues) => {
  log.info(`Client-side importing ${enhancedIssues.length} issues...`);
  
  try {
    // Process each issue and create downloadable files
    const results = await Promise.all(enhancedIssues.map(async (issue) => {
      try {
        const fileName = issue.fileName || `req${issue.number} - ${issue.title.replace(/[^\w\s-]/g, '')}.md`;
        const content = issue.markdownContent || `Issue #: ${issue.number}\n\nBody:\n\n${issue.body || ''}\n\nComments:\n`;
        
        // Add filepath comment at the top
        const finalContent = `<!-- filepath: c:\\Users\\pc790\\whatsfresh\\Projects\\wf-client\\docs\\requirements\\${fileName} -->\n${content}`;
        
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
        
        log.info(`Generated file: ${fileName}`);
        return { 
          issueNumber: issue.number, 
          fileName, 
          success: true 
        };
      } catch (error) {
        log.error(`Error generating file for issue #${issue.number}:`, error);
        return {
          issueNumber: issue.number,
          success: false,
          error: error.message
        };
      }
    }));
    
    // Count successful imports
    const successCount = results.filter(r => r.success).length;
    
    return {
      success: true,
      count: successCount,
      total: enhancedIssues.length,
      results
    };
  } catch (error) {
    log.error('Error importing issues:', error);
    throw new Error(error.message); // Don't add "Import failed:" prefix
  }
};
