import ColMapBuild from '../../../utils/ColMapBuild';
import createLogger from '../../../utils/logger';

const log = createLogger('IngredientTypes.columns');

// Create the column map using builder pattern
const builder = new ColMapBuild('IngredientTypes')
  .setIdField('ingrTypeID', 'id')
  .setTable('ingredient_types')
  .setListEvent('ingrTypeList')
  .setParentIdField('acctID', 'account_id')
  
  // Basic fields - Group 1
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
  });

// For debugging during development
if (process.env.NODE_ENV !== 'production') {
  log.info('IngredientTypes column map:');
  builder.debug();
}

// Build and export the final column map
const columnMap = builder.build();

console.log('Structure comparison:', {
  'config exists': !!columnMap.config,
  'listEvent in config': columnMap.config?.listEvent,
  'listEvent directly': columnMap.listEvent
});

log.info('Final columnMap:', columnMap);
export default columnMap;
