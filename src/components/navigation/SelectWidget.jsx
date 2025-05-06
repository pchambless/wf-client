import React, { useState, useEffect, useMemo } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, CircularProgress } from '@mui/material';
import { usePollVar, setVars, triggerAction } from '../../utils/externalStore';
import createLogger from '../../utils/logger';

const log = createLogger('SelectWidget');

/**
 * A select widget that can be populated by a list event
 * and depend on other select widgets
 */
const SelectWidget = ({ id, label, listEvent, dependsOn, storeKey }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Get the current value
  const value = usePollVar(storeKey, '');
  
  // Wrap dependsOn in useMemo to stabilize it
  const dependenciesArray = useMemo(() => dependsOn || [], [dependsOn]);
  
  // Create separate variables for each potential dependency
  const dep1 = usePollVar(dependenciesArray[0] ? `:selected_${dependenciesArray[0]}` : null, null);
  const dep2 = usePollVar(dependenciesArray[1] ? `:selected_${dependenciesArray[1]}` : null, null);
  const dep3 = usePollVar(dependenciesArray[2] ? `:selected_${dependenciesArray[2]}` : null, null);
  
  // Fetch options when dependencies change
  useEffect(() => {
    async function fetchOptions() {
      // Get dependencies directly from dep1, dep2, dep3
      const depsValues = [dep1, dep2, dep3].slice(0, dependenciesArray.length);
      
      // Skip if we have dependencies that aren't selected yet
      if (dependenciesArray.length > 0 && depsValues.some(dep => !dep)) {
        setOptions([]);
        return;
      }
      
      setLoading(true);
      try {
        // Create parameters object from dependencies
        const params = dependenciesArray.reduce((acc, dep, index) => {
          acc[dep] = depsValues[index];
          return acc;
        }, {});
          
        // Trigger the list event to get options
        const result = await triggerAction(listEvent, params, true);
        if (Array.isArray(result)) {
          setOptions(result);
        } else {
          log.warn(`Expected array from ${listEvent} but got:`, result);
          setOptions([]);
        }
      } catch (error) {
        log.error(`Error fetching options for ${id}:`, error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }
    
    if (listEvent) {
      fetchOptions();
    }
  }, [id, listEvent, dependenciesArray, dep1, dep2, dep3]);
  
  // Handle selection change
  const handleChange = (event) => {
    const selectedValue = event.target.value;
    log.debug(`Select ${id} changed to:`, selectedValue);
    setVars(storeKey, selectedValue);
  };
  
  return (
    <Box sx={{ minWidth: 180, position: 'relative' }}>
      <FormControl fullWidth size="small">
        <InputLabel id={`${id}-label`}>{label}</InputLabel>
        <Select
          labelId={`${id}-label`}
          value={value}
          label={label}
          onChange={handleChange}
          disabled={loading || options.length === 0}
        >
          {options.map(option => (
            <MenuItem 
              key={option.id || option.value} 
              value={option.id || option.value}
            >
              {option.name || option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {loading && (
        <CircularProgress 
          size={24} 
          sx={{ position: 'absolute', right: 24, top: '50%', mt: -1.5 }} 
        />
      )}
    </Box>
  );
};

export default SelectWidget;
