import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Photos = () => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [photoPosts, setPhotoPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    caption: '',
    category: 'study-setup'
  });

  // Fetch photos from backend
  const fetchPhotos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/photos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setPhotoPosts(response.data.photos);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a photo to upload');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('photo', selectedFile);
      formData.append('caption', newPhoto.caption);
      formData.append('category', newPhoto.category);

      await axios.post('http://localhost:5000/api/photos', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Refresh the photos list
      await fetchPhotos();
      
      // Reset form
      setShowUploadForm(false);
      setNewPhoto({ caption: '', category: 'study-setup' });
      setSelectedFile(null);
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError(err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
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

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

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
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileSelect}
                      id="photo-upload"
                    />
                    <label 
                      htmlFor="photo-upload"
                      className="cursor-pointer inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Choose File
                    </label>
                    {selectedFile && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected: {selectedFile.name}
                      </p>
                    )}
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
                  <button 
                    type="submit" 
                    disabled={uploading}
                    className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Share Photo'}
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
          {loading ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">Loading photos...</p>
            </div>
          ) : photoPosts.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">No photos yet. Upload your first photo!</p>
            </div>
          ) : (
            photoPosts.map((photo) => (
              <div key={photo._id} className="card overflow-hidden">
                <div className="aspect-square bg-gray-200 flex items-center justify-center text-gray-400">
                  {photo.imageUrl ? (
                    <img src={`http://localhost:5000${photo.imageUrl}`} alt={photo.caption} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <div className="text-6xl mb-2">...</div>
                      <p className="text-sm">Study Photo</p>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {photo.user?.initials || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{photo.user?.name || 'Unknown User'}</p>
                        <p className="text-xs text-gray-500">{new Date(photo.createdAt).toLocaleDateString()}</p>
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
                        <span className="text-sm">{photo.likeCount || photo.likes?.length || 0}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                        <span>...</span>
                        <span className="text-sm">{photo.commentCount || photo.comments?.length || 0}</span>
                      </button>
                    </div>
                    <button className="text-gray-600 hover:text-blue-600">
                      <span>...</span>
                    </button>
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

export default Photos;
