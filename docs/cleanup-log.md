# Code Cleanup Log

## 2025-03-15: Removed PageUtils
- File: `src/utils/pageUtils.js`
- Status: ✅ Removed (unused)
- Previous Functionality:
  - `fetchTableList`: Now handled by eventStore
  - `getFormColumns`: Now handled by formStore
  - Used EventTypeContext (deprecated)
  - Used useLogger hook
