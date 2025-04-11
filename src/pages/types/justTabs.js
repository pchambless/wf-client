// Re-export from new location
import JustTabs from '../common/justTabs';

// Add deprecation warning
console.warn('Importing justTabs from src/pages/types is deprecated. Please import from src/pages/common instead.');

export default JustTabs;
