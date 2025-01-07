import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useEventTypeContext } from './EventTypeContext';
import { useVariableContext } from './VariableContext';
import useLogger from '../hooks/useLogger';

const SelectContext = createContext();
const fileName = 'SelectContext: ';

export const useSelectContext = () => useContext(SelectContext);

const SelectProvider = ({ children }) => {
  const logAndTime = useLogger(fileName);
  const { getEventTypeParams, eventTypeLookup } = useEventTypeContext();
  const { variables } = useVariableContext();
  const [selectOptions, setSelectOptions] = useState({});

  const mappings = useMemo(() => ({
    selUserAccts: { eventType: 'userAccts', id: 'accountId', label: 'accountName' },
    selIngrTypes: { eventType: 'ingrTypeList', id: 'id', label: 'name' },
  }), []);

  const fetchSelectOptions = useCallback(async (key) => {
    const mapping = mappings[key];
    if (!mapping) {
      console.warn(logAndTime(`No mapping found for key ${key}`));
      setSelectOptions(prev => ({ ...prev, [key]: [] }));
      return;
    }

    const { eventType, id, label } = mapping;

    logAndTime(`Fetching options for ${key} with eventType ${eventType}`);

    const params = getEventTypeParams(eventType);
    if (!params) {
      console.warn(logAndTime(`Params not defined for eventType ${eventType}`));
      setSelectOptions(prev => ({ ...prev, [key]: [] }));
      return;
    }

    const resolvedParams = params.reduce((acc, param) => {
      const variableName = param.replace(':', ''); // Remove ':' prefix
      acc[param] = variables[variableName];
      return acc;
    }, {});

    try {
      const eventTypeData = await eventTypeLookup(eventType, resolvedParams);
      if (!Array.isArray(eventTypeData)) {
        throw new Error(`Expected array but received ${typeof eventTypeData}`);
      }

      const options = eventTypeData.map(item => ({
        value: item[id],
        label: item[label],
      }));
      setSelectOptions(prev => ({ ...prev, [key]: options }));
      logAndTime('Options fetched successfully:', options);
    } catch (error) {
      logAndTime(`Error fetching options for ${key}:`, error);
      setSelectOptions(prev => ({ ...prev, [key]: [] }));
    }
  }, [getEventTypeParams, eventTypeLookup, mappings, logAndTime, variables]);

  return (
    <SelectContext.Provider value={{ selectOptions, fetchSelectOptions }}>
      {children}
    </SelectContext.Provider>
  );
};

export { SelectProvider };
export default SelectContext;
