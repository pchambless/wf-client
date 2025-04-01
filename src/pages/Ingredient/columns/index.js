import { IngrTypes } from './ingrTypes';
import { Ingredients } from './ingredients';
import { IngrBatches } from './ingrBatches';

// Export individual column maps
export { IngrTypes, Ingredients, IngrBatches };

// Export combined map for backwards compatibility
export const columnMap = {
    IngrTypes,
    Ingredients,
    IngrBatches
};
