import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection
import Navbar from '../../components/Navbar/Navbar';
import LinkCard from '../../components/LinkCard/LinkCard';

export default function Home() {
  const [links, setLinks] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newLink, setNewLink] = useState({ title: '', description: '' });
  const [showModal, setShowModal] = useState(false);  // State for modal visibility
  const [modalMessage, setModalMessage] = useState('');  // State for modal message
  const navigate = useNavigate();  // Hook for navigation
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");
  
  
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Check if the token is expired (you can decode the JWT or rely on backend response)
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.exp * 1000 < Date.now()) {
          // Token is expired, redirect to login
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    checkTokenExpiration();
  }, [navigate]);

  useEffect(() => {
    console.log("Dashboard useEffect triggered, sortBy:", sortBy);
    const fetchLinks = async () => {
      setLoading(true);
      setError('');
      console.log("Fetching links from:", `${API_BASE_URL}/api/links?sort=${sortBy}`);

      try {
        const response = await fetch(`${API_BASE_URL}/api/links?sort=${sortBy}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        console.log("Response status:", response.status);

        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

        const data = await response.json();
        console.log("Fetched data:", data);
        setLinks(data);
      } catch (err) {
        console.error("Error fetching links:", err);
        setError(err.message || 'Failed to fetch links');
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [sortBy, API_BASE_URL]);

  const handleRating = async (linkId, value) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/links/${linkId}/rate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ linkId, value })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Rating failed');
      }
  
      const updatedLink = await response.json();
      
      setLinks(prevLinks => 
        prevLinks.map(link => 
          link.id === linkId ? updatedLink : link
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleHideLink = async (linkId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/links/${linkId}/hide`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      console.log('Hide response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to hide link');
      }
  
      setLinks(prevLinks => {
        const updated = prevLinks.filter(link => link.id !== linkId);
        console.log('Updated links after hiding:', updated);
        return updated;
      });
      
    } catch (err) {
      console.error('Hide link error details:', err);
      setError(err.message || 'Failed to hide link. Please try again.');
    }
  };

  const handleNewLinkSubmit = async (e) => {
    e.preventDefault();
    const { title, description } = newLink;
  
    // Ensure title and description are provided
    if (!title || !description) {
      setError('Title and description are required.');
      return;
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to create a new link.');
      localStorage.removeItem('token');
      navigate('/login');
      return;
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Use the token here
        },
        body: JSON.stringify({ title, description })
      });
  
      if (response.ok) {
        const newLinkData = await response.json();
        setLinks(prevLinks => [newLinkData, ...prevLinks]); // Add the new link to the list
        setNewLink({ title: '', description: '' }); // Reset the form
  
        // Show the success modal
        setModalMessage('Link created successfully!');
        setShowModal(true);
  
        // Close the modal and redirect after 3 seconds
        setTimeout(() => {
          setShowModal(false); // Hide the modal after 3 seconds
          navigate('/dashboard'); // Redirect to the dashboard
        }, 3000);
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        setError(`Failed to create the new link: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred while creating the link.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Raccoon Community Links</h1>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded-md px-4 py-2"
            >
              <option value="recent">Most Recent</option>
              <option value="top">Highest Rated</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center text-gray-600">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              Loading raccoon links...
            </div>
          ) : (
            <div className="space-y-6">
              {links.length > 0 ? (
                links.map(link => (
                  <LinkCard
                    key={link.id}
                    link={link}
                    onRate={handleRating}
                    onHide={handleHideLink}
                  />
                ))
              ) : (
                <div className="text-center text-gray-600">
                  No raccoon links found. Be the first to share!
                </div>
              )}
            </div>
          )}

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add a New Link</h2>
            <form onSubmit={handleNewLinkSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newLink.description}
                  onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Add Link
              </button>
            </form>
          </div>
        </main>

        {/* Success Modal */}
        {showModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-green-600">{modalMessage}</h3>
              <div className="mt-4 text-center">
                <div className="animate-pulse">Redirecting...</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
