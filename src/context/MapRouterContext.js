import React, { createContext, useContext } from 'react';
import mapRouter from '../utils/mapRouter';

const MapRouterContext = createContext();

export const MapRouterProvider = ({ children }) => {
  return (
    <MapRouterContext.Provider value={mapRouter}>
      {children}
    </MapRouterContext.Provider>
  );
};

export const useMapRouter = () => useContext(MapRouterContext);
