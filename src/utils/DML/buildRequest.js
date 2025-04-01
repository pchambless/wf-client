import createLogger from '../logger';

const log = createLogger('DML.buildRequest');

export const buildDmlRequest = (formData, columnMap, formMode) => {
  if (!columnMap || !formMode) {
    log.error('Invalid DML parameters', { hasColumnMap: !!columnMap, formMode });
    return null;
  }

  // Convert formMode to SQL method
  const method = formMode === 'add' ? 'INSERT' : 
                formMode === 'edit' ? 'UPDATE' : 
                formMode === 'delete' ? 'DELETE' : null;

  if (!method) {
    log.error('Invalid form mode:', formMode);
    return null;
  }

  // Get fields marked as where clause fields or fallback to primary key
  const whereFields = columnMap
    .filter(col => col.where === 1 || col.group === -1)
    .map(col => ({
      field: col.field,
      value: formData[col.field]
    }));

  // Get fields to update/insert (all visible fields)
  const dataFields = columnMap
    .filter(col => col.group > 0)
    .map(col => ({
      field: col.field,
      value: formData[col.field]
    }));

  return {
    method,
    table: columnMap[0]?.dbTable,
    where: whereFields,
    data: dataFields
  };
};
