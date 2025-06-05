import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  // When the success modal is shown, automatically redirect after 2.5 seconds.
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/dashboard");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim().toLowerCase(), password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }
  
      const data = await response.json();
  
      // Save the token and reload the page
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard"; // Redirect immediately
      
    } catch (err) {
      setError(err.message);
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <Navbar />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-8 shadow-lg transform transition-all duration-500 
                          animate-scaleFadeIn">
            <div className="flex flex-col items-center">
              {/* Checkmark Icon */}
              <svg
                className="w-16 h-16 text-green-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M5 13l4 4L19 7" />
              </svg>
              <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
              <p className="text-gray-600">Login successful. Redirecting to dashboard...</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
            Login to your account
          </h2>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md 
                             shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 
                             focus:border-blue-500 sm:text-sm"
                  placeholder="Your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md 
                             shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 
                             focus:border-blue-500 sm:text-sm"
                  placeholder="Your password"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                           shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Not registered yet?{' '}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Tailwind CSS Animation (using a custom keyframe) */}
      <style jsx="true">{`
        @keyframes scaleFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleFadeIn {
          animation: scaleFadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
