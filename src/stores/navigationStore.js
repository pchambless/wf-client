import { create } from 'zustand';
import createLogger from '../utils/logger';

const log = createLogger('navigationStore');

const useNavigationStore = create((set) => ({
  breadcrumbs: [],
  pageTitle: '',

  setBreadcrumbs: (breadcrumbs) => {
    const uniqueBreadcrumbs = breadcrumbs
      .filter((item, index, array) => 
        array.findIndex(t => t.text === item.text) === index)
      .filter(item => item.text !== 'Home');
    set({ breadcrumbs: uniqueBreadcrumbs });
  },

  setPageTitle: (title) => set({ pageTitle: title })
}));

export { useNavigationStore };
