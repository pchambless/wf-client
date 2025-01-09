import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useEventTypeContext } from './EventTypeContext';
import useLogger from '../hooks/useLogger';

const SelectContext = createContext();
const fileName = 'SelectContext: ';

export const useSelectContext = () => useContext(SelectContext);

const SelectProvider = ({ children }) => {
  const logAndTime = useLogger(fileName);
  const { execEvent } = useEventTypeContext();
  const [selectOptions, setSelectOptions] = useState({});

  const mappings = useMemo(() => ({
    selUserAccts: { eventType: 'userAccts', id: 'acct_id', varName: ':acctID', label: 'account_name', labelName: ':acctName' },
    selIngrTypes: { eventType: 'ingrTypeList', id: 'id', varName: ':ingrTypeID', label: 'name', labelName: ':ingrTypeName' },
  }), []);

  const fetchSelectOptions = useCallback(async (key) => {
    const mapping = mappings[key];
    if (!mapping) {
      console.warn(logAndTime(`No mapping found for key ${key}`));
      setSelectOptions(prev => ({ ...prev, [key]: [] }));
      return;
    }

    const { eventType, id, label, varName, labelName } = mapping;

    logAndTime(`Fetching options for ${key} with eventType ${eventType}`);

    try {
      const options = await execEvent(eventType, {});
      
      console.log('eventTypeData:', options);

      if (!Array.isArray(options)) {
        throw new Error(`Expected array but received ${typeof options}`);
      }

      const mappedOptions = options.map(item => ({
        value: item[id],
        label: item[label],
      }));

      console.log('options:', mappedOptions);
      setSelectOptions(prev => ({ ...prev, [key]: { options: mappedOptions, varName, labelName } }));
    } catch (error) {
      logAndTime(`Error fetching options for ${key}:`, error);
      setSelectOptions(prev => ({ ...prev, [key]: [] }));
    }
  }, [execEvent, mappings, logAndTime]);

  return (
    <SelectContext.Provider value={{ selectOptions, fetchSelectOptions }}>
      {children}
    </SelectContext.Provider>
  );
};

export { SelectProvider };
export default SelectContext;
