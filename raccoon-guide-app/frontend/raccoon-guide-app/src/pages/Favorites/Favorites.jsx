import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LinkCard from '../../components/LinkCard/LinkCard';
import Navbar from '../../components/Navbar/Navbar';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/me/favorites`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch favorites');
        
        const data = await response.json();
        setFavorites(data);
      } catch (err) {
        setError(err.message);
        console.error("Favorites fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    
    <div className="min-h-screen bg-gray-100">
        <Navbar />
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Your Favorite Raccoon Links
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-600">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            Loading your favorites...
          </div>
        ) : (
          <div className="space-y-6">
            {favorites.map(link => (
              <LinkCard
                key={link.id}
                link={link}
                onRate={() => {}}
                onHide={() => {}}
              />
            ))}
            {favorites.length === 0 && (
              <div className="text-center text-gray-600">
                No favorites yet! Start rating links you love.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}