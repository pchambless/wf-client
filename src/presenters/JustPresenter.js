// Re-export from new location
import JustPresenter from '../pages/common/JustPresenter';

// Add deprecation warning
console.warn('Importing JustPresenter from src/presenters is deprecated. Please import from src/pages/common instead.');

export default JustPresenter;
