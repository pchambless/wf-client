import React, { useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Checkbox, Paper, Box 
} from '@mui/material';
import createLogger from '../../utils/logger';

// Fix: Use the default import pattern correctly
const log = createLogger('IssueImporter.List');

// Debug log when the component mounts
const IssueList = ({ issues, selectedIssues, onSelect }) => {
  // Add useEffect for debugging component mount
  useEffect(() => {
    console.log("IssueList component mounted, logger:", log);
    log.info("IssueList component mounted");
  }, []);
  
  // Fix 1: Simplify toggle function with more direct approach
  const handleToggleSelect = (e, issueId) => {
    // Add immediate console log for debugging
    console.log(`Checkbox clicked for issue #${issueId}`, e.target.checked);
    
    // Stop event propagation
    e.stopPropagation();
    
    // Create a new object to ensure state updates properly
    const newSelectedIssues = { ...selectedIssues };
    newSelectedIssues[issueId] = !selectedIssues[issueId];
    
    // Call onSelect with the new object
    onSelect(newSelectedIssues);
    
    // Fix 2: Use console.log directly for guaranteed logging
    console.log(`Toggle selection for issue #${issueId} to: ${!selectedIssues[issueId]}`);
  };
  
  // Fix 3: Simplify select all handler
  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    console.log("Select all clicked:", checked);
    
    const newSelected = {};
    if (checked) {
      issues.forEach(issue => {
        newSelected[issue.number] = true;
      });
    }
    
    // Call onSelect with the new object directly
    onSelect(newSelected);
    console.log("Select all toggled:", checked, "for", issues.length, "issues");
  };
  
  const isAllSelected = issues.length > 0 && 
    issues.every(issue => selectedIssues[issue.number]);
  
  const numSelected = Object.values(selectedIssues).filter(Boolean).length;
  
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" sx={{ py: 0.5 }}>
              <Checkbox
                indeterminate={numSelected > 0 && numSelected < issues.length}
                checked={isAllSelected}
                onChange={handleSelectAll}
                size="small"
                onClick={(e) => e.stopPropagation()} // Prevent row click
              />
            </TableCell>
            <TableCell sx={{ py: 0.5 }}>Issue #</TableCell>
            <TableCell sx={{ py: 0.5 }}>Title</TableCell>
            <TableCell sx={{ py: 0.5 }}>State</TableCell>
            <TableCell sx={{ py: 0.5 }}>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {issues.map(issue => (
            <TableRow 
              key={issue.number}
              hover
              selected={!!selectedIssues[issue.number]}
              sx={{ height: 38 }}
            >
              <TableCell padding="checkbox" sx={{ py: 0.5 }}>
                {/* Fix 4: Use onChange, make sure event doesn't bubble, and simplify */}
                <Checkbox 
                  checked={!!selectedIssues[issue.number]}
                  onChange={(e) => {
                    e.stopPropagation();
                    console.log(`Checkbox change for issue #${issue.number}`, e.target.checked);
                    handleToggleSelect(e, issue.number);
                  }}
                  onClick={(e) => {
                    // Double ensure the event stops
                    e.stopPropagation();
                  }}
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
                    py: 0.2,
                    borderRadius: 1,
                    bgcolor: issue.state === 'open' ? 'success.light' : 'grey.400',
                    color: 'white',
                    fontSize: '0.75rem'
                  }}
                >
                  {issue.state}
                </Box>
              </TableCell>
              <TableCell sx={{ py: 0.5 }}>{new Date(issue.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
          {issues.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No issues found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default IssueList;
