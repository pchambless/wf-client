import { PageMapBuilder } from '@pageMapBuild';
import createLogger from '@utils/logger';

const log = createLogger('IngrTypes.pageMap');

let pageMapCache = null;

log.info('loading pageMap');

const getPageMap = () => {
  if (!pageMapCache) {
    pageMapCache = new PageMapBuilder('IngredientTypes')
      // Page configuration
      .setIdField('ingrTypeID', 'id')
      .setTable('ingredient_types')
      .setListEvent('ingrTypeList')
      .setParentIdField('acctID', 'account_id')
      .setPageTitle('Ingredient Types')
      .setNavigateTo('/ingredients/types')
      
      // Column definitions (same as before)
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
  return pageMapCache;
};

export default getPageMap;
