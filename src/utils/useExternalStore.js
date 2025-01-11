import { useSyncExternalStore } from 'react';
import { getVars, subscribe, setVars, listVars, getVar } from './externalStore';

const useExternalStore = () => {
  return useSyncExternalStore(
    subscribe, 
    getVars, 
    () => getVars()  // This function provides the server snapshot, can be adjusted as needed
  );
};

export { setVars, listVars, getVar };
export default useExternalStore;
