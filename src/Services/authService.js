// src/services/authService.js
// Mock user database
const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123', // In real app, never store plain passwords!
    role: 'admin'
  },
  {
    id: 2,
    name: 'Support Agent',
    email: 'agent@example.com',
    password: 'agent123',
    role: 'agent'
  },
  {
    id: 3,
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user'
  }
];

// Simulate network delay
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 500));

export const authService = {
  async login(email, password) {
    await simulateNetworkDelay();
    
    const user = mockUsers.find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Return user data without password
    const { password: _, ...userData } = user;
    return userData;
  },

  async register(userData) {
    await simulateNetworkDelay();

    const emailExists = mockUsers.some(u => u.email === userData.email);
    if (emailExists) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      role: 'user' // Default role
    };

    mockUsers.push(newUser);
    
    // Return user data without password
    // const { password: _, ...userData } = newUser;
    return userData;
  }
};