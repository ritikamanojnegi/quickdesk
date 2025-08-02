import express from 'express';
import Ticket from '../models/ticket.model.js';
import {
  createTicket,
  getTicketById,
  getUserTickets,
  getAgentTickets,
  getAllTickets,
  updateTicketStatus,
  addComment,
  voteTicket
} from '../controllers/ticket.controller.js';
import { verifyToken, isAdmin, isAgentOrAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Create a new ticket
router.post('/', createTicket);

// Get tickets based on role
router.get('/me', getUserTickets);
router.get('/agent', isAgentOrAdmin, getAgentTickets);
router.get('/all', isAdmin, getAllTickets);

// Get specific ticket
router.get('/:id', async (req, res, next) => {
  try {
    // Check if user has access to this ticket
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Allow access if user is admin, agent, or the ticket creator
    if (
      req.user.role === 'admin' ||
      req.user.role === 'agent' ||
      ticket.createdBy.toString() === req.user._id.toString()
    ) {
      next();
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}, getTicketById);

// Update ticket status
router.put('/:id/status', isAgentOrAdmin, updateTicketStatus);

// Add comment to ticket
router.post('/:id/comments', addComment);

// Vote on a ticket
router.post('/:id/vote', voteTicket);

export default router;
