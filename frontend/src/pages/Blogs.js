import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Blogs = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    tags: '',
    category: 'study-tips'
  });

  // Fetch blog posts from backend
  const fetchBlogPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/blogs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setBlogPosts(response.data.posts);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const blogData = {
        ...newBlog,
        tags: newBlog.tags ? newBlog.tags.split(',').map(tag => tag.trim()) : []
      };
      
      await axios.post('http://localhost:5000/api/blogs', blogData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Refresh the blog posts list
      await fetchBlogPosts();
      
      // Reset form
      setShowCreateForm(false);
      setNewBlog({ title: '', content: '', tags: '', category: 'study-tips' });
    } catch (err) {
      console.error('Error creating blog post:', err);
      setError(err.response?.data?.message || 'Failed to create blog post');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Student Blogs</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn btn-primary"
          >
            Write Blog
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Write a New Blog Post</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter your blog title"
                    value={newBlog.title}
                    onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea
                    className="input-field"
                    rows={8}
                    placeholder="Share your thoughts and experiences..."
                    value={newBlog.content}
                    onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
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
                      value={newBlog.category}
                      onChange={(e) => setNewBlog({...newBlog, category: e.target.value})}
                    >
                      <option value="study-tips">Study Tips</option>
                      <option value="technical">Technical</option>
                      <option value="lifestyle">Lifestyle</option>
                      <option value="career">Career</option>
                      <option value="research">Research</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="study, programming, tips"
                      value={newBlog.tags}
                      onChange={(e) => setNewBlog({...newBlog, tags: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="btn btn-primary">
                    Publish Blog
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
              <p className="text-gray-600">Loading blog posts...</p>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No blog posts yet. Write your first blog!</p>
            </div>
          ) : (
            blogPosts.map((post) => (
              <article key={post._id} className="card">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    {post.user?.initials || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">{post.user?.name || 'Unknown User'}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()} · {post.readTime ? `${post.readTime} min read` : '5 min read'}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                    <p className="text-gray-600 mb-3">{post.excerpt || post.content.substring(0, 150) + '...'}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-6">
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                        <span>...</span>
                        <span>{post.likeCount || post.likes?.length || 0}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                        <span>...</span>
                        <span>{post.commentCount || post.comments?.length || 0}</span>
                      </button>
                      <button className="text-gray-600 hover:text-blue-600">
                        Read More
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
