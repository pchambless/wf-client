import { Navigate } from 'react-router-dom';
import IngredientTypePage from '../pages/Ingredient/IngredientTypeList';
import IngredientPage from '../pages/Ingredient/IngredientList';
import IngredientBatchPage from '../pages/Ingredient/IngredientBatchList';

const IngredientRoutes = [
  // Redirect base path to the first level
  {
    path: "/ingredients",
    element: <Navigate to="/ingredients/types" replace />
  },
  
  // Level 1: Ingredient Types
  {
    path: "/ingredients/types",
    element: <IngredientTypePage />
  },
  
  // Level 2: Ingredients for a specific type
  {
    path: "/ingredients/types/:ingrTypeID/ingredients",
    element: <IngredientPage />
  },
  
  // Level 3: Batches for a specific ingredient
  {
    path: "/ingredients/types/:typeId/ingredients/:ingrID/batches",
    element: <IngredientBatchPage />
  }
];

export default IngredientRoutes;
