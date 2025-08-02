import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext.jsx';
import LoadingSpinner from './Loadingspinner.jsx';

const PrivateRoute = ({ children, adminOnly = false, agentOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingSpinner />;
  
  if (!user) return <Navigate to="/login" />;

  // Allow access based on role
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  if (agentOnly && user.role !== 'agent') {
    return <Navigate to="/" />;
  }

  // Prevent admin/agent from accessing normal user routes
  if (!adminOnly && !agentOnly && (user.role === 'admin' || user.role === 'agent')) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;