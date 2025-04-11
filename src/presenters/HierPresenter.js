// Re-export from new location
import HierPresenter from '../pages/common/HierPresenter';

// Add deprecation warning
console.warn('Importing HierPresenter from src/presenters is deprecated. Please import from src/pages/common instead.');

export default HierPresenter;
