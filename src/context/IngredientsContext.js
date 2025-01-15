import React, { createContext, useContext, useState } from 'react';
import { setVars, getVar } from '../utils/externalStore';

const IngredientsContext = createContext();

export const IngredientsProvider = ({ children }) => {
  const [ingrTypes, setIngrTypes] = useState(getVar('ingrTypes') || []);
  const [ingrs, setIngrs] = useState(getVar('ingrs') || []);
  const [ingrBtchs, setIngrBtchs] = useState(getVar('ingrBtchs') || []);
  const [ingrTypeID, setIngrTypeID] = useState(getVar('ingrTypeID') || '');
  const [ingrID, setIngrID] = useState(getVar('ingrID') || '');
  const [ingrBtchID, setIngrBtchID] = useState(getVar('ingrBtchID') || '');
  const [pageTitle, setPageTitle] = useState('');

  const updateState = (setter, key, value) => {
    setter(value);
    setVars({ [key]: value });
  };

  return (
    <IngredientsContext.Provider value={{
      ingrTypes, setIngrTypes: (value) => updateState(setIngrTypes, 'ingrTypes', value),
      ingrTypeID, setIngrTypeID: (value) => updateState(setIngrTypeID, 'ingrTypeID', value),
      ingrs, setIngrs: (value) => updateState(setIngrs, 'ingrs', value),
      ingrID, setIngrID: (value) => updateState(setIngrID, 'ingrID', value),
      ingrBtchs, setIngrBtchs: (value) => updateState(setIngrBtchs, 'ingrBtchs', value),
      ingrBtchID, setIngrBtchID: (value) => updateState(setIngrBtchID, 'ingrBtchID', value),
      pageTitle, setPageTitle
    }}>
      {children}
    </IngredientsContext.Provider>
  );
};

export const useIngredientsContext = () => useContext(IngredientsContext);
