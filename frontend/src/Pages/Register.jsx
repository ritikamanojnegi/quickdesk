import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../Components/auth/RegisterForm';
import { AuthContext } from '../Context/AuthContext.jsx';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [error, setError] = useState('');

  const handleRegister = async (userData) => {
    try {
      await register(userData);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.'); // More specific error
    }
  };

  return (
    <div className="auth-page">
      <h1>Register for QuickDesk</h1>
      {error && <div className="error-message">{error}</div>}
      <RegisterForm onSubmit={handleRegister} />
    </div>
  );
};

export default Register;