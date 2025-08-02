import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = ({ adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingSpinner />;
  
  if (!user) return <Navigate to="/login" />;
  
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;

  return <Outlet />;
};

export default PrivateRoute;