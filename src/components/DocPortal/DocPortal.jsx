import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Tab, Tabs, CircularProgress } from '@mui/material';
import MarkdownRenderer from './MarkdownRenderer';
import { refreshDocumentation, fetchAvailableDocs, fetchDocContent } from './docService';

const DocPortal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [docCategories, setDocCategories] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docContent, setDocContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAvailableDocs();
  }, []);

  const loadAvailableDocs = async () => {
    setLoading(true);
    try {
      const docs = await fetchAvailableDocs();
      setDocCategories(docs.categories || []);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load documentation:", error);
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSelectedDoc(null);
    setDocContent('');
  };

  const handleDocSelect = async (docPath) => {
    setSelectedDoc(docPath);
    setLoading(true);
    try {
      const content = await fetchDocContent(docPath);
      setDocContent(content);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load document:", error);
      setDocContent(`# Error Loading Document\n\n${error.message}`);
      setLoading(false);
    }
  };

  const handleRefreshDocs = async () => {
    setRefreshing(true);
    try {
      await refreshDocumentation();
      await loadAvailableDocs(); // Reload docs after refresh
      setRefreshing(false);
    } catch (error) {
      console.error("Failed to refresh documentation:", error);
      setRefreshing(false);
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">WhatsFresh Documentation</Typography>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleRefreshDocs}
            disabled={refreshing}
            startIcon={refreshing && <CircularProgress size={20} color="inherit" />}
            sx={{ mr: 2 }}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Docs'}
          </Button>
          <Button variant="outlined" onClick={onClose}>Close</Button>
        </Box>
      </Box>
      
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        {docCategories.map((category, index) => (
          <Tab key={index} label={category.name} />
        ))}
      </Tabs>
      
      <Box sx={{ display: 'flex', height: 'calc(100% - 100px)', mt: 2 }}>
        {/* Document list sidebar */}
        {docCategories.length > 0 && docCategories[activeTab] && (
          <Box sx={{ width: '25%', borderRight: 1, borderColor: 'divider', pr: 2, overflow: 'auto' }}>
            {docCategories[activeTab].documents.map((doc, index) => (
              <Box 
                key={index} 
                sx={{ 
                  p: 1, 
                  cursor: 'pointer', 
                  bgcolor: selectedDoc === doc.path ? 'action.selected' : 'transparent',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => handleDocSelect(doc.path)}
              >
                <Typography variant="body2">{doc.title}</Typography>
              </Box>
            ))}
          </Box>
        )}
        
        {/* Document content area */}
        <Box sx={{ width: selectedDoc ? '75%' : '100%', pl: selectedDoc ? 2 : 0, overflow: 'auto' }}>
          {loading && <CircularProgress />}
          {!loading && !selectedDoc && (
            <Typography variant="body1" color="text.secondary">
              Select a document from the sidebar to view its contents
            </Typography>
          )}
          {!loading && selectedDoc && (
            <MarkdownRenderer markdown={docContent} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DocPortal;
