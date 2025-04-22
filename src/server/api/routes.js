const express = require('express');
const router = express.Router();

// Import all API modules
const { importIssues } = require('./issueImporterApi');

// Define routes
router.post('/admin/importIssues', importIssues);

module.exports = router;
