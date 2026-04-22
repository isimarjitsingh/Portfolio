import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              StudyShare
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/study-progress" className="text-gray-700 hover:text-blue-600 transition-colors">
              Study Progress
            </Link>
            <Link to="/blogs" className="text-gray-700 hover:text-blue-600 transition-colors">
              Blogs
            </Link>
            <Link to="/photos" className="text-gray-700 hover:text-blue-600 transition-colors">
              Photos
            </Link>
            {isAuthenticated && (
              <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition-colors">
                Profile
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600 mr-2">
                  Welcome, {user?.name?.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
