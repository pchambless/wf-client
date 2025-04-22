const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const router = express.Router();
const sanitize = require('sanitize-filename');

const requiresAdmin = (req, res, next) => {
  // Add your authentication check here
  if (req.session?.user?.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

// Apply admin middleware to all routes
router.use(requiresAdmin);

// Import GitHub issues to requirements folder
router.post('/importIssues', async (req, res) => {
  try {
    const { issues } = req.body;
    
    if (!Array.isArray(issues) || issues.length === 0) {
      return res.status(400).json({ error: 'No issues to import' });
    }
    
    const requirementsDir = path.join(process.cwd(), 'docs', 'requirements');
    await fs.ensureDir(requirementsDir);
    
    const results = [];
    
    for (const issue of issues) {
      const issueNumber = issue.number;
      const title = issue.title;
      const body = issue.body || '';
      const labels = issue.labels.map(label => label.name).join(', ');
      const state = issue.state;
      const comments = [];
      
      // Get comments if any
      if (issue.comments > 0) {
        const commentsUrl = issue.comments_url;
        // TODO: Fetch comments from GitHub API
      }
      
      // Create markdown content
      const content = `<!-- filepath: c:\\Users\\pc790\\whatsfresh\\Projects\\wf-client\\docs\\requirements\\req${issueNumber} ${sanitize(title)}.md -->
Issue #: ${issueNumber}

Body:

${body}

Comments:
${comments.join('\n\n')}
`;
      
      // Write to file
      const filename = `req${issueNumber} ${sanitize(title)}.md`;
      const filepath = path.join(requirementsDir, filename);
      await fs.writeFile(filepath, content);
      
      results.push({
        issueNumber,
        filename,
        success: true
      });
    }
    
    return res.json({
      success: true,
      count: results.length,
      imported: results
    });
  } catch (error) {
    console.error('Error importing issues:', error);
    return res.status(500).json({
      error: 'Failed to import issues',
      message: error.message
    });
  }
});

module.exports = router;
