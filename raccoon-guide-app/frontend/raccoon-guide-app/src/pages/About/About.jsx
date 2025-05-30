import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          About Raccoon
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          Raccoon is a dynamic online platform designed for raccoon enthusiasts to share interesting links, exchange ideas, and make new friends.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Whether you're here to explore the latest raccoon-themed content, share your favorite finds, or connect with a community of like-minded individuals, Raccoon offers a secure and engaging experience.
        </p>
        <p className="text-lg text-gray-700">
          Our platform emphasizes ease-of-use, seamless navigation, and robust security measures to ensure that your interactions are both enjoyable and safe.
        </p>
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            At Raccoon, our mission is to build a vibrant community where raccoon enthusiasts from around the world can connect, share their passions, and contribute to an ever-growing repository of raccoon-related content. We believe in fostering creativity, collaboration, and a friendly environment that welcomes everyone.
          </p>
          <div className="text-center">
            <Link
              to="/login"
              className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Explore More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
