import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/user.model.js';
import Category from '../models/category.model.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Clear existing data
      await User.deleteMany({});
      await Category.deleteMany({});
      
      // Create default users
      const users = [
        {
          name: 'Test User',
          email: 'user@example.com',
          password: await bcrypt.hash('user123', 10),
          role: 'user',
          createdAt: new Date('2023-01-15')
        },
        {
          name: 'Test Agent',
          email: 'agent@example.com',
          password: await bcrypt.hash('agent123', 10),
          role: 'agent',
          createdAt: new Date('2023-01-10')
        },
        {
          name: 'Admin User',
          email: 'admin@example.com',
          password: await bcrypt.hash('admin123', 10),
          role: 'admin',
          createdAt: new Date('2023-01-01')
        }
      ];
      
      await User.insertMany(users);
      console.log('Default users created');
      
      // Create default categories
      const categories = [
        {
          name: 'Hardware',
          description: 'Issues related to physical equipment'
        },
        {
          name: 'Software',
          description: 'Issues related to applications and programs'
        },
        {
          name: 'Network',
          description: 'Issues related to connectivity and network services'
        },
        {
          name: 'Email',
          description: 'Issues related to email services'
        },
        {
          name: 'Account',
          description: 'Issues related to user accounts and permissions'
        }
      ];
      
      await Category.insertMany(categories);
      console.log('Default categories created');
      
      console.log('Database initialization completed');
    } catch (error) {
      console.error('Database initialization failed:', error);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });