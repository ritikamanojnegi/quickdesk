import Ticket from '../models/ticket.model.js';
import mongoose from 'mongoose';

export const createTicket = async (req, res) => {
  try {
    const { subject, description, category, priority, attachments } = req.body;
    
    const newTicket = new Ticket({
      subject,
      description,
      category,
      priority: priority || 'Medium',
      createdBy: req.user._id,
      attachments: attachments || []
    });
    
    await newTicket.save();
    
    // Populate user and category information
    const populatedTicket = await Ticket.findById(newTicket._id)
      .populate('createdBy', 'name email')
      .populate('category', 'name')
      .populate('assignedTo', 'name email');
    
    res.status(201).json(populatedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('category', 'name')
      .populate('assignedTo', 'name email')
      .populate('comments.userId', 'name email');
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserTickets = async (req, res) => {
  try {
    const { status, category, search, sort } = req.query;
    
    let query = { createdBy: req.user._id };
    
    // Apply filters
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    let sortOption = {};
    
    // Apply sorting
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'updated':
        sortOption = { updatedAt: -1 };
        break;
      case 'mostVoted':
        sortOption = { 'votes.up': -1 };
        break;
      case 'mostCommented':
        sortOption = { 'comments.length': -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    const tickets = await Ticket.find(query)
      .sort(sortOption)
      .populate('createdBy', 'name email')
      .populate('category', 'name')
      .populate('assignedTo', 'name email');
    
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAgentTickets = async (req, res) => {
  try {
    const { status, category, search, sort } = req.query;
    
    let query = {};
    
    // If specific agent, only show assigned tickets
    if (req.user.role === 'agent') {
      query.assignedTo = req.user._id;
    }
    
    // Apply filters (same as getUserTickets)
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    let sortOption = {};
    
    // Apply sorting (same as getUserTickets)
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'updated':
        sortOption = { updatedAt: -1 };
        break;
      case 'mostVoted':
        sortOption = { 'votes.up': -1 };
        break;
      case 'mostCommented':
        sortOption = { 'comments.length': -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    const tickets = await Ticket.find(query)
      .sort(sortOption)
      .populate('createdBy', 'name email')
      .populate('category', 'name')
      .populate('assignedTo', 'name email');
    
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const { status, category, search, sort } = req.query;
    
    let query = {};
    
    // Apply filters (same as other methods)
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    let sortOption = {};
    
    // Apply sorting (same as other methods)
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'updated':
        sortOption = { updatedAt: -1 };
        break;
      case 'mostVoted':
        sortOption = { 'votes.up': -1 };
        break;
      case 'mostCommented':
        sortOption = { 'comments.length': -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    const tickets = await Ticket.find(query)
      .sort(sortOption)
      .populate('createdBy', 'name email')
      .populate('category', 'name')
      .populate('assignedTo', 'name email');
    
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Update status
    ticket.status = status;
    
    // If agent is assigning themselves and ticket is not assigned
    if (req.user.role === 'agent' && !ticket.assignedTo && status === 'In Progress') {
      ticket.assignedTo = req.user._id;
    }
    
    await ticket.save();
    
    // Return updated ticket with populated fields
    const updatedTicket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('category', 'name')
      .populate('assignedTo', 'name email')
      .populate('comments.userId', 'name email');
    
    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Create new comment
    const newComment = {
      userId: req.user._id,
      content,
      createdAt: new Date()
    };
    
    // Add comment to ticket
    ticket.comments.push(newComment);
    await ticket.save();
    
    // Get the newly added comment
    const addedComment = ticket.comments[ticket.comments.length - 1];
    
    // Populate user information for the new comment
    const populatedTicket = await Ticket.findById(req.params.id)
      .populate('comments.userId', 'name email');
    
    const populatedComment = populatedTicket.comments.id(addedComment._id);
    
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const voteTicket = async (req, res) => {
  try {
    const { voteType } = req.body;
    
    // Validate vote type
    if (voteType !== 'up' && voteType !== 'down') {
      return res.status(400).json({ message: 'Invalid vote type' });
    }
    
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    
    // Update vote count
    if (voteType === 'up') {
      ticket.votes.up += 1;
    } else {
      ticket.votes.down += 1;
    }
    
    await ticket.save();
    
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};