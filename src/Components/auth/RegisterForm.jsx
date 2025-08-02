import React, { useState } from 'react';

const RegisterForm = ({ onSubmit }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (userData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        name: userData.name,
        email: userData.email,
        password: userData.password
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <div className="error">{errors.password}</div>}
      </div>
      <div className="form-group">
        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={userData.confirmPassword}
          onChange={handleChange}
          required
        />
        {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;