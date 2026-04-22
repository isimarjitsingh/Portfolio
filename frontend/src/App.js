import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import StudyProgress from './pages/StudyProgress';
import Blogs from './pages/Blogs';
import Photos from './pages/Photos';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/study-progress" element={isAuthenticated ? <StudyProgress /> : <Navigate to="/login" />} />
        <Route path="/blogs" element={isAuthenticated ? <Blogs /> : <Navigate to="/login" />} />
        <Route path="/photos" element={isAuthenticated ? <Photos /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
