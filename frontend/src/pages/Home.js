import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
          Welcome to StudyShare
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect with fellow students, share your learning journey, and inspire others
        </p>
        <div className="space-x-4">
          <Link to="/register" className="btn btn-primary text-lg px-6 py-3">
            Get Started
          </Link>
          <Link to="/study-progress" className="btn btn-secondary text-lg px-6 py-3">
            Explore
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="card text-center">
          <div className="text-blue-600 text-4xl mb-4">...</div>
          <h3 className="text-xl font-semibold mb-2">Share Progress</h3>
          <p className="text-gray-600">
            Document your study journey and track your learning milestones
          </p>
        </div>
        <div className="card text-center">
          <div className="text-green-600 text-4xl mb-4">...</div>
          <h3 className="text-xl font-semibold mb-2">Write Blogs</h3>
          <p className="text-gray-600">
            Share your knowledge and experiences through detailed blog posts
          </p>
        </div>
        <div className="card text-center">
          <div className="text-purple-600 text-4xl mb-4">...</div>
          <h3 className="text-xl font-semibold mb-2">Share Photos</h3>
          <p className="text-gray-600">
            Capture and share moments from your academic life
          </p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Join Our Community of Learners
        </h2>
        <p className="text-gray-600 mb-6">
          Connect with students from around the world and grow together
        </p>
        <Link to="/register" className="btn btn-primary">
          Join Now
        </Link>
      </div>
    </div>
  );
};

export default Home;
