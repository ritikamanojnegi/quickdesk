import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/ui/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/ui/PrivateRoute';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="app-container">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            {/* Add more routes as needed */}
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
