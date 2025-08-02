import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');

  const handleLogin = async (credentials) => {
    try {
      await login(credentials.email, credentials.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password'); // More specific error
    }
  };

  return (
    <div className="auth-page">
      <h1>Login to QuickDesk</h1>
      {error && <div className="error-message">{error}</div>}
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
};

export default Login;