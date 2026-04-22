import React, { useState } from 'react';

const Photos = () => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    caption: '',
    category: 'study-setup'
  });

  const photoPosts = [
    {
      id: 1,
      author: 'Grace Lee',
      avatar: 'GL',
      caption: 'My productive study setup for final exams week! Multiple monitors help with research papers.',
      category: 'study-setup',
      imageUrl: null,
      likes: 156,
      comments: 28,
      time: '3 hours ago'
    },
    {
      id: 2,
      author: 'Henry Zhang',
      avatar: 'HZ',
      caption: 'Beautiful sunset from the university library after a long coding session',
      category: 'campus-life',
      imageUrl: null,
      likes: 89,
      comments: 12,
      time: '5 hours ago'
    },
    {
      id: 3,
      author: 'Isabella Martinez',
      avatar: 'IM',
      caption: 'Handwritten notes for organic chemistry. Color coding helps me remember complex reactions!',
      category: 'notes',
      imageUrl: null,
      likes: 234,
      comments: 45,
      time: '1 day ago'
    },
    {
      id: 4,
      author: 'Jack Thompson',
      avatar: 'JT',
      caption: 'Team study session at the campus coffee shop. Great discussion about machine learning concepts!',
      category: 'group-study',
      imageUrl: null,
      likes: 78,
      comments: 15,
      time: '2 days ago'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to upload photo
    console.log('New photo:', newPhoto);
    setShowUploadForm(false);
    setNewPhoto({ caption: '', category: 'study-setup' });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'study-setup': 'bg-blue-100 text-blue-800',
      'campus-life': 'bg-green-100 text-green-800',
      'notes': 'bg-purple-100 text-purple-800',
      'group-study': 'bg-yellow-100 text-yellow-800',
      'achievements': 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Study Photos</h1>
          <button
            onClick={() => setShowUploadForm(true)}
            className="btn btn-primary"
          >
            Upload Photo
          </button>
        </div>

        {showUploadForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Share a Study Photo</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="text-gray-400">
                      <div className="text-4xl mb-2">...</div>
                      <p className="text-sm">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Caption
                  </label>
                  <textarea
                    className="input-field"
                    rows={2}
                    placeholder="Tell us about this photo..."
                    value={newPhoto.caption}
                    onChange={(e) => setNewPhoto({...newPhoto, caption: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    className="input-field"
                    value={newPhoto.category}
                    onChange={(e) => setNewPhoto({...newPhoto, category: e.target.value})}
                  >
                    <option value="study-setup">Study Setup</option>
                    <option value="campus-life">Campus Life</option>
                    <option value="notes">Notes</option>
                    <option value="group-study">Group Study</option>
                    <option value="achievements">Achievements</option>
                  </select>
                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="btn btn-primary">
                    Share Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photoPosts.map((photo) => (
            <div key={photo.id} className="card overflow-hidden">
              <div className="aspect-square bg-gray-200 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-6xl mb-2">...</div>
                  <p className="text-sm">Study Photo</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {photo.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{photo.author}</p>
                      <p className="text-xs text-gray-500">{photo.time}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(photo.category)}`}>
                    {photo.category.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-gray-700 text-sm mb-3">{photo.caption}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-red-600">
                      <span>...</span>
                      <span className="text-sm">{photo.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                      <span>...</span>
                      <span className="text-sm">{photo.comments}</span>
                    </button>
                  </div>
                  <button className="text-gray-600 hover:text-blue-600">
                    <span>...</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Photos;
