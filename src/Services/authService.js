// src/services/authService.js
// Mock user database
const mockUsers = [
  {
    id: '1',
    name: 'Test User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    createdAt: new Date('2023-01-15').toISOString()
  },
  {
    id: '2',
    name: 'Test Agent',
    email: 'agent@example.com',
    password: 'agent123',
    role: 'agent',
    createdAt: new Date('2023-01-10').toISOString()
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date('2023-01-01').toISOString()
  }
];

// Simulate network delay
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 500));

export const authService = {
  async login(email, password) {
    await simulateNetworkDelay();
    
    const user = mockUsers.find(
      user => user.email === email && user.password === password
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
    
    // Check if email already exists
    const emailExists = mockUsers.some(user => user.email === userData.email);
    if (emailExists) {
      throw new Error('Email already in use');
    }
    
    // Create new user
    const newUser = {
      id: String(mockUsers.length + 1),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: 'user', // Default role for new registrations
      createdAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    
    // Return user data without password
    const { password: _, ...newUserData } = newUser;
    return newUserData;
  },
  
  async getAllUsers() {
    await simulateNetworkDelay();
    
    // Return users without passwords
    return mockUsers.map(user => {
      const { password: _, ...userData } = user;
      return userData;
    });
  },
  
  async updateUser(userId, userData) {
    await simulateNetworkDelay();
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Check if email is being changed and if it's already in use
    if (userData.email !== mockUsers[userIndex].email) {
      const emailExists = mockUsers.some(u => u.email === userData.email && u.id !== userId);
      if (emailExists) {
        throw new Error('Email already in use');
      }
    }
    
    // Update user data
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      name: userData.name,
      email: userData.email,
      role: userData.role
    };
    
    // Return updated user without password
    const { password: _, ...updatedUserData } = mockUsers[userIndex];
    return updatedUserData;
  },
  
  async deleteUser(userId) {
    await simulateNetworkDelay();
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Remove user
    mockUsers.splice(userIndex, 1);
    
    return { success: true };
  }
};