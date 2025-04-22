import createLogger from '../../utils/logger';

const log = createLogger('IssueImporter.Formatter');

// Format issue markdown content
export const formatIssueAsMarkdown = (issue, enhancedData) => {
  try {
    // Get basic issue data
    const issueNumber = issue.number;
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

// Format file name for issue
export const formatFileName = (issue) => {
  const issueNumber = issue.number;
  const title = issue.title.trim();
  const sanitizedTitle = title.replace(/[^\w\s-]/g, '');
  return `req${issueNumber} - ${sanitizedTitle}.md`;
};
