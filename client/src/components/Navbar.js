import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Sasta Templates
          </Link>
          
          <div className="flex space-x-4">
            <Link to="/playground" className="text-indigo-600 hover:text-indigo-800 font-semibold">
              Playground
            </Link>
            <Link to="/components/category/navbar" className="text-gray-600 hover:text-gray-800">
              Navbars
            </Link>
            <Link to="/components/category/footer" className="text-gray-600 hover:text-gray-800">
              Footers
            </Link>
            <Link to="/components/category/dropdown" className="text-gray-600 hover:text-gray-800">
              Dropdowns
            </Link>
            <Link to="/components/category/login" className="text-gray-600 hover:text-gray-800">
              Login Forms
            </Link>
            <Link to="/components/category/register" className="text-gray-600 hover:text-gray-800">
              Register Forms
            </Link>
            <Link to="/components/category/box" className="text-gray-600 hover:text-gray-800">
              Boxes
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-600">Welcome, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 