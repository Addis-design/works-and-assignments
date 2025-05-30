import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  // Check auth status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token) {
      setIsLoggedIn(true);
      setUsername(storedUsername || 'Raccoon Friend');
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    window.location.href = "/"; // Redirect to login
  };
  
  return (
    <nav className="bg-white shadow-md relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="absolute left-4 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2">
            <Link to="/" className="flex items-center">
              <span className="text-3xl">🦝</span>
              <h1 className="ml-2 text-xl font-bold text-gray-900">Raccoon Guide</h1>
            </Link>
          </div>

          {/* Desktop Menu - Right-aligned */}
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            <div className="flex space-x-6">
            {isLoggedIn && (
               <Link to="/" className="text-gray-700 hover:text-blue-600 transition font-medium">
               Home
             </Link> 
              )}
              <Link to="/favorites" className="text-gray-700 hover:text-blue-600 transition font-medium">
  Favorites
</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition font-medium">
                About
              </Link>
             
            </div>

            <div className="h-6 w-px bg-gray-200 mx-4"></div>

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {username}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden ml-auto">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3 px-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition font-medium">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition font-medium">
                About
              </Link>
              {isLoggedIn && (
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition font-medium">
                  Profile
                </Link>
              )}
              <div className="h-px bg-gray-200 my-2"></div>
              {isLoggedIn ? (
                <div className="flex flex-col space-y-3">
                  <span className="text-gray-700">Welcome, {username}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium text-left"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 transition font-medium">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
