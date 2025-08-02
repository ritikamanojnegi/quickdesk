import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Admin only routes
router.get('/', isAdmin, getAllUsers);
router.delete('/:id', isAdmin, deleteUser);

// Get own profile or admin can get any profile
router.get('/:id', (req, res, next) => {
  if (req.user.role === 'admin' || req.user._id.toString() === req.params.id) {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
}, getUserById);

// Update own profile or admin can update any profile
router.put('/:id', (req, res, next) => {
  if (req.user.role === 'admin' || req.user._id.toString() === req.params.id) {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
}, updateUser);

export default router;