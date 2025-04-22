import ApiService from '../../services/ApiService';

// Hub API URLs
const DOC_API_BASE = '/api/workflow/docs';

/**
 * Fetch available documentation categories and files
 */
export async function fetchAvailableDocs() {
  try {
    const response = await ApiService.get(`${DOC_API_BASE}/list`);
    return response.data;
  } catch (error) {
    console.error('Error fetching documentation list:', error);
    throw new Error('Failed to load documentation index');
  }
}

/**
 * Fetch content of a specific documentation file
 */
export async function fetchDocContent(path) {
  try {
    const response = await ApiService.get(`${DOC_API_BASE}/content`, {
      params: { path }
    });
    return response.data.content;
  } catch (error) {
    console.error('Error fetching document content:', error);
    throw new Error('Failed to load document content');
  }
}

/**
 * Trigger documentation refresh from the server
 */
export async function refreshDocumentation() {
  try {
    // First regenerate navigation structure
    await ApiService.post(`${DOC_API_BASE}/generate-current-navigation`);
    
    // Then regenerate entity map
    await ApiService.post(`${DOC_API_BASE}/generate-entity-map`);
    
    // Generate comparison to target
    await ApiService.get(`${DOC_API_BASE}/compare-navigation`);
    
    return true;
  } catch (error) {
    console.error('Error refreshing documentation:', error);
    throw new Error('Failed to refresh documentation');
  }
}

/**
 * Fetch onboarding help for a specific area
 */
export async function fetchOnboardingHelp(area) {
  try {
    const response = await ApiService.get(`${DOC_API_BASE}/onboarding/${area}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching onboarding help:', error);
    throw new Error('Failed to load onboarding content');
  }
}
