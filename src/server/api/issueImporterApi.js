const fs = require('fs').promises;
const path = require('path');
const createLogger = require('../../utils/logger').default;

const log = createLogger('IssueImporterAPI');

/**
 * Handles importing GitHub issues to Markdown files
 */
async function importIssues(req, res) {
  try {
    const { issues } = req.body;
    
    if (!Array.isArray(issues) || issues.length === 0) {
      return res.status(400).json({ error: 'No issues provided' });
    }
    
    log.info(`Processing ${issues.length} issues for import`);
    
    // Define target directory - using the requirements folder path
    const requirementsDir = path.join(process.cwd(), 'docs', 'requirements');
    
    // Ensure directory exists
    await fs.mkdir(requirementsDir, { recursive: true });
    
    // Process each issue
    const results = await Promise.all(issues.map(async (issue) => {
      try {
        const fileName = issue.fileName || `req${issue.number} - ${issue.title.replace(/[^\w\s-]/g, '')}.md`;
        const filePath = path.join(requirementsDir, fileName);
        
        // Use provided markdown content if available
        const content = issue.markdownContent || `Issue #: ${issue.number}\n\nBody:\n\n${issue.body || ''}\n\nComments:\n`;
        
        // Add filepath comment at the top
        const finalContent = `<!-- filepath: c:\\Users\\pc790\\whatsfresh\\Projects\\wf-client\\docs\\requirements\\${fileName} -->\n${content}`;
        
        // Write to file
        await fs.writeFile(filePath, finalContent, 'utf8');
        
        log.info(`Issue #${issue.number} imported successfully as ${fileName}`);
        
        return {
          issueNumber: issue.number,
          fileName,
          success: true
        };
      } catch (error) {
        log.error(`Error importing issue #${issue.number}:`, error);
        return {
          issueNumber: issue.number,
          success: false,
          error: error.message
        };
      }
    }));
    
    // Count successes
    const successCount = results.filter(r => r.success).length;
    
    return res.json({
      success: true,
      total: issues.length,
      count: successCount,
      results
    });
  } catch (error) {
    log.error('Error in importIssues:', error);
    return res.status(500).json({
      error: 'Failed to import issues',
      message: error.message
    });
  }
}

module.exports = {
  importIssues
};
