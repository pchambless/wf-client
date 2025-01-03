import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const AppNav = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = (menuName) => {
    setActiveMenu((prevMenu) => (prevMenu === menuName ? null : menuName));
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <nav className="flex p-4 space-x-4 bg-gray-200 whitespace-nowrap">
      {/* Dashboard Link */}
      <div onClick={navigateToDashboard} className="p-2 border rounded cursor-pointer">
        Dashboard
      </div>

      {/* Ingredients Dropdown */}
      <div className="relative">
        <button onClick={() => toggleMenu('ingredients')} className="p-2 border rounded">
          Ingredients
        </button>
        {activeMenu === 'ingredients' && (
          <div className="absolute mt-2 bg-white border rounded shadow-lg">
            <NavLink to="/ingredients" className="block px-4 py-2 hover:bg-gray-100">
              Ingredient Types
            </NavLink>
            <NavLink to="/ingredients/ingr" className="block px-4 py-2 hover:bg-gray-100">
              Ingredients
            </NavLink>
            <NavLink to="/ingredients/ingrbtch" className="block px-4 py-2 hover:bg-gray-100">
              Ingredient Batches
            </NavLink>
          </div>
        )}
      </div>

      {/* Products Dropdown */}
      <div className="relative">
        <button onClick={() => toggleMenu('products')} className="p-2 border rounded">
          Products
        </button>
        {activeMenu === 'products' && (
          <div className="absolute mt-2 bg-white border rounded shadow-lg">
            <NavLink to="/products/prodtype" className="block px-4 py-2 hover:bg-gray-100">
              Product Types
            </NavLink>
            <NavLink to="/products/prod" className="block px-4 py-2 hover:bg-gray-100">
              Products
            </NavLink>
            <NavLink to="/products/rcpe" className="block px-4 py-2 hover:bg-gray-100">
              Recipes
            </NavLink>
            <NavLink to="/products/prodbtch" className="block px-4 py-2 hover:bg-gray-100">
              Product Batches
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AppNav;
