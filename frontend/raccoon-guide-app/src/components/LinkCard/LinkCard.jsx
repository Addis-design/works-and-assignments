import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';

export default function LinkCard({ link, onRate, onHide }) {
  const isAuthenticated = !!localStorage.getItem('token');
  const currentUserId = localStorage.getItem('userId');

  // Safely access nested properties
  const { 
    title = 'Untitled Link',
    description,
    created_at: createdAt,
    user = {},
    score = 0,
    upvotes = 0,
    downvotes = 0,
    ratings = []
  } = link || {};

  // Get user's existing rating
  const userRating = ratings.find(r => r.user_id === currentUserId)?.value;

  // Handle rating actions
  const handleRating = (value) => {
    if (!isAuthenticated) {
      alert("Please log in to rate links");
      return;
    }
    if (user.id === currentUserId) {
      alert("You cannot rate your own links");
      return;
    }
    onRate(link.id, value);
  };

  // Format creation date safely
  const formattedDate = createdAt && !isNaN(new Date(createdAt)) 
    ? formatDistanceToNow(new Date(createdAt)) 
    : 'recently';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {title}
          </h2>
          <p className="text-gray-600 mb-4">
            {description || 'No description provided'}
          </p>
          
          <div className="flex flex-wrap items-center text-sm text-gray-500 gap-2">
            <span className="flex items-center">
              Submitted by: 
              <span className="font-medium ml-1">
                {user?.username || 'Anonymous'} 
                <span className="ml-1">({user?.raccoon_points || 0} 🦝)</span>
              </span>
            </span>
            <span>•</span>
            <span className="text-gray-400">
              {formattedDate} ago
            </span>
          </div>
        </div>

        {isAuthenticated && (
          <button 
            onClick={() => onHide(link.id)}
            className="text-gray-400 hover:text-red-600 transition-colors ml-4"
            aria-label="Hide link"
            title="Hide this link"
          >
            ×
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleRating(1)}
            disabled={!!userRating || user.id === currentUserId}
            className={`px-3 py-1 rounded-md transition-colors ${
              userRating === 1 
                ? 'bg-green-100 text-green-600 cursor-default'
                : userRating || user.id === currentUserId
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            aria-label="Upvote this link"
          >
            👍 {upvotes}
          </button>
          
          <span className="text-lg font-medium text-gray-700 min-w-[60px] text-center">
            {Math.max(score, 0)}
          </span>

          <button
            onClick={() => handleRating(-1)}
            disabled={!!userRating || user.id === currentUserId}
            className={`px-3 py-1 rounded-md transition-colors ${
              userRating === -1 
                ? 'bg-red-100 text-red-600 cursor-default'
                : userRating || user.id === currentUserId
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            aria-label="Downvote this link"
          >
            👎 {downvotes}
          </button>
        </div>
      </div>
    </div>
  );
}

LinkCard.propTypes = {
  link: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    created_at: PropTypes.string,
    user: PropTypes.shape({
      id: PropTypes.number,
      username: PropTypes.string,
      raccoon_points: PropTypes.number
    }),
    score: PropTypes.number,
    upvotes: PropTypes.number,
    downvotes: PropTypes.number,
    ratings: PropTypes.arrayOf(PropTypes.shape({
      user_id: PropTypes.number,
      value: PropTypes.number
    }))
  }).isRequired,
  onRate: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired
};