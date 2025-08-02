// src/services/authService.js
// Real API service
const API_URL = 'http://localhost:5000/api';

export const authService = {
  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Invalid email or password');
    }
    
    return response.json();
  },
  
  async register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  },
  
  async getAllUsers() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    const response = await fetch(`${API_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get users');
    }
    
    return response.json();
  },
  
  async updateUser(userId, userData) {
    const user = JSON.parse(localStorage.getItem('user'));
    
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user');
    }
    
    return response.json();
  },
  
  async deleteUser(userId) {
    const user = JSON.parse(localStorage.getItem('user'));
    
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete user');
    }
    
    return response.json();
  }
};