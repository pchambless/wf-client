import ProductTypes from './ProductTypes';
import Products from './Products';
import ProductBatches from './ProductBatches';

const productsRoutes = [
  {
    path: '/products/types',
    element: <ProductTypes />
  },
  {
    path: '/products/types/:typeId/products',
    element: <Products />
  },
  {
    path: '/products/types/:typeId/products/:productId/batches',
    element: <ProductBatches />
  }
];

export default productsRoutes;
