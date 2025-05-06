import ColMapBuild from '../../../utils/ColMapBuild';
import createLogger from '../../../utils/logger';

const log = createLogger('IngredientTypes.columns');
let columnMapCache = null;

const getColumnMap = () => {
  if (!columnMapCache) {
    columnMapCache = new ColMapBuild('IngredientTypes')
      .setIdField('ingrTypeID', 'id')
      .setTable('ingredient_types')
      .setListEvent('ingrTypeList') // Ensure this is set correctly
      .setParentIdField('acctID', 'account_id')
      .addTextColumn('ingrTypeName', 'name', 'Type Name', {
        group: 1,
        ordr: 1,
        required: true,
        width: 180
      })
      .addTextColumn('ingrTypeDesc', 'description', 'Description', {
        group: 2,
        ordr: 2,
        multiLine: true,
        width: 240
      })
      .build();
  }
  return columnMapCache;
};

// For debugging during development
if (process.env.NODE_ENV !== 'production' && process.env.DEBUG_COLUMNS) {
  log.info('IngredientTypes column map:');
  const map = getColumnMap();
  if (map && typeof map.debug === 'function') {
    map.debug();
  } else {
    log.warn('Column map does not have debug method');
  }
  
  // Use the map here, not columnMap (which doesn't exist)
  log.info('Final columnMap:', getColumnMap());
}

export default getColumnMap;
