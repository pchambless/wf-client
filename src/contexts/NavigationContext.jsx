import React, { createContext, useContext, useEffect, useState } from 'react';
import NavigationFactory from '../factories/NavigationFactory';

const NavigationContext = createContext();
const navigationService = NavigationFactory.createService();

export const NavigationProvider = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState(navigationService.getBreadcrumbs());
  
  useEffect(() => {
    const unsubscribe = navigationService.subscribe(newBreadcrumbs => {
      setBreadcrumbs(newBreadcrumbs);
    });
    
    return () => unsubscribe();
  }, []);
  
  return (
    <NavigationContext.Provider value={{ 
      navigationService,
      breadcrumbs,
      navigationItems: NavigationFactory.createNavigationTree()
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
