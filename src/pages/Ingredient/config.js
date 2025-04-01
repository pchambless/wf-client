import { columnMap } from './columns';

// Debug log the columnMap during module load
console.log('Loading ingredient config with columnMap:', {
  hasColumnMap: !!columnMap,
  keys: Object.keys(columnMap),
  ingrTypesStructure: columnMap.IngrTypes
});

export const pageConfig = {
    pageName: 'Ingredients',
    tabConfiguration: [
        {
            label: 'Ingredient Types',
            columnMap: columnMap.IngrTypes,
            listEvent: 'ingrTypeList'
        },
        {
            label: 'Ingredients',
            columnMap: columnMap.Ingredients,
            listEvent: 'ingrList'
        },
        {
            label: 'Batches',
            columnMap: columnMap.IngrBatches,
            listEvent: 'ingrBtchList'
        }
    ]
};
