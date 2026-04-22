import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Navigate to home page on successful login
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-white/20">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
              SS
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Welcome Back</h1>
            <p className="text-xl text-gray-600">Sign in to continue your learning journey</p>
          </div>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="student@university.edu"
                value={formData.email}
                onChange={handleChange}
                name="email"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Password
              </label>
              <input
                type="password"
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                name="password"
                required
              />
            </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
