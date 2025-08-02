import express from 'express';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route - anyone can get categories
router.get('/', getAllCategories);

// Admin only routes
router.post('/', verifyToken, isAdmin, createCategory);
router.put('/:id', verifyToken, isAdmin, updateCategory);
router.delete('/:id', verifyToken, isAdmin, deleteCategory);

export default router;