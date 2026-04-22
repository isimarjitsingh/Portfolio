import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudyProgress = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [progressPosts, setProgressPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newProgress, setNewProgress] = useState({
    title: '',
    description: '',
    category: 'course',
    progress: 0
  });

  // Fetch progress posts from backend
  const fetchProgressPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/progress', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProgressPosts(response.data.posts);
    } catch (err) {
      console.error('Error fetching progress posts:', err);
      setError('Failed to load progress posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/progress', newProgress, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Refresh the progress posts list
      await fetchProgressPosts();
      
      // Reset form
      setShowCreateForm(false);
      setNewProgress({ title: '', description: '', category: 'course', progress: 0 });
    } catch (err) {
      console.error('Error creating progress post:', err);
      setError(err.response?.data?.message || 'Failed to create progress post');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Study Progress</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary"
          >
            Share Progress
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Share Your Progress</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="What did you accomplish?"
                    value={newProgress.title}
                    onChange={(e) => setNewProgress({...newProgress, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="Tell us more about your progress..."
                    value={newProgress.description}
                    onChange={(e) => setNewProgress({...newProgress, description: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      className="input-field"
                      value={newProgress.category}
                      onChange={(e) => setNewProgress({...newProgress, category: e.target.value})}
                    >
                      <option value="course">Course</option>
                      <option value="project">Project</option>
                      <option value="research">Research</option>
                      <option value="skill">Skill</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Progress (%)
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      min="0"
                      max="100"
                      value={newProgress.progress}
                      onChange={(e) => setNewProgress({...newProgress, progress: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="btn btn-primary">
                    Share Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading progress posts...</p>
            </div>
          ) : progressPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No progress posts yet. Share your first progress!</p>
            </div>
          ) : (
            progressPosts.map((post) => (
              <div key={post._id} className="card">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {post.user?.initials || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{post.user?.name || 'Unknown User'}</h3>
                        <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mt-2">{post.title}</h4>
                    <p className="text-gray-600 mt-1">{post.description}</p>
                    
                    {post.progress > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{post.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${post.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-6 mt-4">
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                        <span>...</span>
                        <span>{post.likeCount || post.likes?.length || 0}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                        <span>...</span>
                        <span>{post.commentCount || post.comments?.length || 0}</span>
                      </button>
                      <button className="text-gray-600 hover:text-blue-600">
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyProgress;
