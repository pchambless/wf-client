import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/tailwind.css';

const AppNav = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = (menuName) => {
    setActiveMenu((prevMenu) => (prevMenu === menuName ? null : menuName));
  };

  const handleNavigation = (path) => {
    navigate(path);
    setActiveMenu(null); // Close the dropdown menu
  };

  return (
    <nav className="flex p-2 space-x-2 bg-gray-200 border-t border-[#008060]">
      {/* Dashboard Link */}
      <div
        onClick={() => handleNavigation('/dashboard')}
        className="px-3 py-1 border rounded cursor-pointer"
      >
        Dashboard
      </div>

      {/* Ingredients Dropdown */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('ingredients')}
          className="px-3 py-1 border rounded"
        >
          Ingredients
        </button>
        {activeMenu === 'ingredients' && (
          <div className="absolute mt-1 bg-white border rounded shadow-lg">
            <NavLink
              to="/ingredients"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setActiveMenu(null)} // Close the dropdown menu
            >
              Ingredient Types
            </NavLink>
            <NavLink
              to="/ingredients/ingr"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setActiveMenu(null)} // Close the dropdown menu
            >
              Ingredients
            </NavLink>
            <NavLink
              to="/ingredients/ingrbtch"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setActiveMenu(null)} // Close the dropdown menu
            >
              Ingredient Batches
            </NavLink>
          </div>
        )}
      </div>

      {/* Products Dropdown */}
      <div className="relative">
        <button
          onClick={() => toggleMenu('products')}
          className="px-3 py-1 border rounded"
        >
          Products
        </button>
        {activeMenu === 'products' && (
          <div className="absolute mt-1 bg-white border rounded shadow-lg">
            <NavLink
              to="/products/prodtype"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setActiveMenu(null)} // Close the dropdown menu
            >
              Product Types
            </NavLink>
            <NavLink
              to="/products/prod"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setActiveMenu(null)} // Close the dropdown menu
            >
              Products
            </NavLink>
            <NavLink
              to="/products/rcpe"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setActiveMenu(null)} // Close the dropdown menu
            >
              Recipes
            </NavLink>
            <NavLink
              to="/products/prodbtch"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setActiveMenu(null)} // Close the dropdown menu
            >
              Product Batches
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AppNav;
