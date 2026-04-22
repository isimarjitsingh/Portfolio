import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('progress');

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Please login to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-600">{user.major} at {user.university || 'University'}</p>
              <p className="text-sm text-gray-500 mt-1">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <button className="btn btn-primary">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('progress')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'progress'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Study Progress
              </button>
              <button
                onClick={() => setActiveTab('blogs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'blogs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Blogs
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'photos'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Photos
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'progress' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Study Progress</h3>
                <div className="card">
                  <h4 className="font-medium text-gray-800">Completed Data Structures Course</h4>
                  <p className="text-gray-600 mt-1">Finished all modules and scored 95% on final exam</p>
                  <p className="text-sm text-gray-500 mt-2">2 days ago</p>
                </div>
                <div className="card">
                  <h4 className="font-medium text-gray-800">Started Machine Learning Project</h4>
                  <p className="text-gray-600 mt-1">Working on image classification using neural networks</p>
                  <p className="text-sm text-gray-500 mt-2">1 week ago</p>
                </div>
              </div>
            )}

            {activeTab === 'blogs' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">My Blog Posts</h3>
                <div className="card">
                  <h4 className="font-medium text-gray-800">Understanding Recursion in Programming</h4>
                  <p className="text-gray-600 mt-1">A comprehensive guide to recursive algorithms...</p>
                  <p className="text-sm text-gray-500 mt-2">3 days ago</p>
                </div>
                <div className="card">
                  <h4 className="font-medium text-gray-800">Tips for Effective Online Learning</h4>
                  <p className="text-gray-600 mt-1">How to stay motivated and productive while studying...</p>
                  <p className="text-sm text-gray-500 mt-2">1 week ago</p>
                </div>
              </div>
            )}

            {activeTab === 'photos' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">My Study Photos</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                    Study Setup
                  </div>
                  <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                    Notes
                  </div>
                  <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                    Library
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
