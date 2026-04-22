import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    major: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Navigate to home page on successful registration
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-700 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-white/20">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg">
              SS
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Create Account</h1>
            <p className="text-xl text-gray-600">Join our student learning community</p>
          </div>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                First Name
              </label>
              <input
                type="text"
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                name="firstName"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Last Name
              </label>
              <input
                type="text"
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                name="lastName"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Email
              </label>
              <input
                type="email"
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="john.doe@example.com"
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
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                name="password"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                name="confirmPassword"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                University
              </label>
              <input
                type="text"
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="Your university name"
                value={formData.university}
                onChange={handleChange}
                name="university"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Major
              </label>
              <input
                type="text"
                className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="Computer Science"
                value={formData.major}
                onChange={handleChange}
                name="major"
                required
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
