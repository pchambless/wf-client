const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { importIssues } = require('./api/issueImporterApi');

const app = express();

// Configure middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../build')));

// API routes
app.post('/api/admin/importIssues', importIssues);

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build/index.html'));
});

// Start the server
const PORT = process.env.PORT || 3002; // Changed port from 3000 to 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
