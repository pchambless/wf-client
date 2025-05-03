import ColMapBuild from '../../../utils/ColMapBuild';
import createLogger from '../../../utils/logger';

const log = createLogger('Ingredients.columns');

// Create the column map using builder pattern
const builder = new ColMapBuild('Ingredients')
  // ID fields now automatically create columns
  .setIdField('ingrID', 'id')
  .setTable('ingredients')
  .setListEvent('ingrList')
  .setParentIdField('ingrTypeID', 'ingredient_type_id')
  
  // Basic fields - Group 1
  .addTextColumn('ingrName', 'name', 'Name', {
    group: 1,
    ordr: 1,
    required: true,
    width: 150
  })
  
  .addTextColumn('ingrCode', 'code', 'Code', {
    group: 1,
    ordr: 2,
    required: true,
    width: 70
  })
  
  // Location/storage fields - Group 2
  .addTextColumn('ingrDfltLoc', 'location', 'Default Loc.', {
    group: 2,
    ordr: 3,
    required: true,
    width: 120
  })
  
  .addNumberColumn('ingrDfltBestBy', 'best_by_days', 'Best By Days', {
    group: 2,
    ordr: 4,
    required: true,
    width: 70
  })
  
  // Description - Group 3
  .addTextColumn('ingrDesc', 'description', 'Description', {
    group: 3,
    ordr: 7,
    multiLine: true
  });

// Build and export the final column map
const columnMap = builder.build();

// For debugging during development
log.debug('Ingredients column map built:', columnMap);

export default columnMap;

// Force log to console during development
log.info('columnMap:', columnMap);
