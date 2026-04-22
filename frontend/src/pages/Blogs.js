import React, { useState } from 'react';

const Blogs = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    tags: '',
    category: 'study-tips'
  });

  const blogPosts = [
    {
      id: 1,
      author: 'David Chen',
      avatar: 'DC',
      title: 'Effective Study Techniques for STEM Students',
      excerpt: 'Discover proven methods to improve your understanding of complex scientific concepts and mathematical problems...',
      content: 'In this comprehensive guide, I share my top study techniques that helped me excel in my STEM courses...',
      category: 'study-tips',
      tags: ['study-tips', 'stem', 'productivity'],
      readTime: '5 min read',
      likes: 89,
      comments: 23,
      time: '1 day ago'
    },
    {
      id: 2,
      author: 'Emma Wilson',
      avatar: 'EW',
      title: 'Balancing Part-time Work and Studies',
      excerpt: 'Practical tips for managing your time effectively when juggling work and academic responsibilities...',
      content: 'Working while studying can be challenging, but with the right strategies, you can succeed at both...',
      category: 'lifestyle',
      tags: ['time-management', 'work-life-balance', 'student-life'],
      readTime: '7 min read',
      likes: 67,
      comments: 15,
      time: '2 days ago'
    },
    {
      id: 3,
      author: 'Frank Miller',
      avatar: 'FM',
      title: 'Introduction to Machine Learning Algorithms',
      excerpt: 'A beginner-friendly overview of common ML algorithms and their practical applications...',
      content: 'Machine learning is transforming industries, and understanding the basics is essential for modern developers...',
      category: 'technical',
      tags: ['machine-learning', 'algorithms', 'programming'],
      readTime: '10 min read',
      likes: 124,
      comments: 34,
      time: '3 days ago'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to create blog post
    console.log('New blog:', newBlog);
    setShowCreateForm(false);
    setNewBlog({ title: '', content: '', tags: '', category: 'study-tips' });
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
          {blogPosts.map((post) => (
            <article key={post.id} className="card">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  {post.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{post.author}</h3>
                      <p className="text-sm text-gray-500">{post.time} · {post.readTime}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-3">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
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
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                      <span>...</span>
                      <span>{post.comments}</span>
                    </button>
                    <button className="text-gray-600 hover:text-blue-600">
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
