// Mock ticket service with local storage persistence

// Initial mock data
let mockTickets = [
  {
    id: 1,
    subject: 'Cannot access email',
    description: 'I am unable to log into my email account since yesterday.',
    category: 'Email',
    status: 'Open',
    priority: 'High',
    createdBy: 3, // Regular user ID
    assignedTo: null,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    comments: [],
    votes: { up: 0, down: 0 },
    attachments: []
  },
  {
    id: 2,
    subject: 'Need software installation',
    description: 'Please install Adobe Photoshop on my workstation.',
    category: 'Software',
    status: 'In Progress',
    priority: 'Medium',
    createdBy: 3, // Regular user ID
    assignedTo: 2, // Agent ID
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    comments: [
      {
        id: 1,
        ticketId: 2,
        userId: 2,
        content: 'I will check the license availability and get back to you.',
        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      }
    ],
    votes: { up: 2, down: 0 },
    attachments: []
  },
  {
    id: 3,
    subject: 'Printer not working',
    description: 'The printer on the 2nd floor is showing error code E502.',
    category: 'Hardware',
    status: 'Resolved',
    priority: 'Low',
    createdBy: 3, // Regular user ID
    assignedTo: 2, // Agent ID
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    comments: [
      {
        id: 2,
        ticketId: 3,
        userId: 2,
        content: 'I will check the printer today.',
        createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      },
      {
        id: 3,
        ticketId: 3,
        userId: 2,
        content: 'The printer has been fixed. It needed a toner replacement.',
        createdAt: new Date(Date.now() - 43200000).toISOString() // 12 hours ago
      }
    ],
    votes: { up: 1, down: 0 },
    attachments: []
  }
];

// Categories
const categories = [
  'Email',
  'Hardware',
  'Software',
  'Network',
  'Account Access',
  'Other'
];

// Load tickets from localStorage if available
const loadTickets = () => {
  const storedTickets = localStorage.getItem('tickets');
  if (storedTickets) {
    mockTickets = JSON.parse(storedTickets);
  } else {
    // Initialize with mock data
    saveTickets();
  }
  return mockTickets;
};

// Save tickets to localStorage
const saveTickets = () => {
  localStorage.setItem('tickets', JSON.stringify(mockTickets));
};

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize tickets
loadTickets();

export const ticketService = {
  // Get all ticket categories
  async getCategories() {
    await delay();
    return categories;
  },

  // Create a new ticket
  async createTicket(ticketData) {
    await delay();
    
    const newTicket = {
      id: mockTickets.length > 0 ? Math.max(...mockTickets.map(t => t.id)) + 1 : 1,
      subject: ticketData.subject,
      description: ticketData.description,
      category: ticketData.category,
      status: 'Open',
      priority: ticketData.priority || 'Medium',
      createdBy: ticketData.userId,
      assignedTo: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      votes: { up: 0, down: 0 },
      attachments: ticketData.attachments || []
    };

    mockTickets.push(newTicket);
    saveTickets();
    return newTicket;
  },

  // Get a specific ticket by ID
  async getTicket(id) {
    await delay();
    const ticket = mockTickets.find(t => t.id === parseInt(id));
    if (!ticket) throw new Error('Ticket not found');
    return ticket;
  },

  // Get tickets for a specific user
  async getUserTickets(userId, filters = {}) {
    await delay();
    loadTickets(); // Refresh from storage
    
    let filteredTickets = mockTickets.filter(t => t.createdBy === parseInt(userId));
    
    // Apply filters
    if (filters.status) {
      filteredTickets = filteredTickets.filter(t => t.status === filters.status);
    }
    
    if (filters.category) {
      filteredTickets = filteredTickets.filter(t => t.category === filters.category);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTickets = filteredTickets.filter(t => 
        t.subject.toLowerCase().includes(searchLower) || 
        t.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort tickets
    if (filters.sort) {
      switch(filters.sort) {
        case 'newest':
          filteredTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'oldest':
          filteredTickets.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case 'updated':
          filteredTickets.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          break;
        case 'mostVoted':
          filteredTickets.sort((a, b) => (b.votes.up - b.votes.down) - (a.votes.up - a.votes.down));
          break;
        case 'mostCommented':
          filteredTickets.sort((a, b) => b.comments.length - a.comments.length);
          break;
        default:
          break;
      }
    }
    
    return filteredTickets;
  },

  // Get tickets for agents (all tickets or assigned to specific agent)
  async getAgentTickets(agentId = null, filters = {}) {
    await delay();
    loadTickets(); // Refresh from storage
    
    let filteredTickets = mockTickets;
    
    // If agentId is provided, filter by assigned tickets
    if (agentId) {
      filteredTickets = filteredTickets.filter(t => t.assignedTo === parseInt(agentId));
    }
    
    // Apply filters (same as getUserTickets)
    if (filters.status) {
      filteredTickets = filteredTickets.filter(t => t.status === filters.status);
    }
    
    if (filters.category) {
      filteredTickets = filteredTickets.filter(t => t.category === filters.category);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTickets = filteredTickets.filter(t => 
        t.subject.toLowerCase().includes(searchLower) || 
        t.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort tickets (same as getUserTickets)
    if (filters.sort) {
      switch(filters.sort) {
        case 'newest':
          filteredTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'oldest':
          filteredTickets.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case 'updated':
          filteredTickets.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          break;
        case 'mostVoted':
          filteredTickets.sort((a, b) => (b.votes.up - b.votes.down) - (a.votes.up - a.votes.down));
          break;
        case 'mostCommented':
          filteredTickets.sort((a, b) => b.comments.length - a.comments.length);
          break;
        default:
          break;
      }
    }
    
    return filteredTickets;
  },

  // Update ticket details
  async updateTicket(id, updateData) {
    await delay();
    loadTickets(); // Refresh from storage
    
    const ticketIndex = mockTickets.findIndex(t => t.id === parseInt(id));
    if (ticketIndex === -1) throw new Error('Ticket not found');
    
    const updatedTicket = {
      ...mockTickets[ticketIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    mockTickets[ticketIndex] = updatedTicket;
    saveTickets();
    return updatedTicket;
  },

  // Update ticket status
  async updateTicketStatus(id, status, agentId = null) {
    await delay();
    loadTickets(); // Refresh from storage
    
    const ticketIndex = mockTickets.findIndex(t => t.id === parseInt(id));
    if (ticketIndex === -1) throw new Error('Ticket not found');
    
    const updatedTicket = {
      ...mockTickets[ticketIndex],
      status,
      updatedAt: new Date().toISOString()
    };
    
    // If agent is assigning themselves
    if (agentId && !mockTickets[ticketIndex].assignedTo) {
      updatedTicket.assignedTo = parseInt(agentId);
    }
    
    mockTickets[ticketIndex] = updatedTicket;
    saveTickets();
    return updatedTicket;
  },

  // Add comment to a ticket
  async addComment(ticketId, commentData) {
    await delay();
    loadTickets(); // Refresh from storage
    
    const ticketIndex = mockTickets.findIndex(t => t.id === parseInt(ticketId));
    if (ticketIndex === -1) throw new Error('Ticket not found');
    
    const newComment = {
      id: mockTickets[ticketIndex].comments.length > 0 
        ? Math.max(...mockTickets[ticketIndex].comments.map(c => c.id)) + 1 
        : 1,
      ticketId: parseInt(ticketId),
      userId: commentData.userId,
      content: commentData.content,
      createdAt: new Date().toISOString()
    };
    
    mockTickets[ticketIndex].comments.push(newComment);
    mockTickets[ticketIndex].updatedAt = new Date().toISOString();
    saveTickets();
    
    return newComment;
  },
  
  // Vote on a ticket
  async voteTicket(ticketId, voteType, userId) {
    await delay();
    loadTickets(); // Refresh from storage
    
    const ticketIndex = mockTickets.findIndex(t => t.id === parseInt(ticketId));
    if (ticketIndex === -1) throw new Error('Ticket not found');
    
    // In a real app, we would track which users have voted
    // For this mock, we'll just increment the count
    if (voteType === 'up') {
      mockTickets[ticketIndex].votes.up += 1;
    } else if (voteType === 'down') {
      mockTickets[ticketIndex].votes.down += 1;
    }
    
    saveTickets();
    return mockTickets[ticketIndex];
  },
  
  // Get all tickets (admin only)
  async getAllTickets(filters = {}) {
    await delay();
    loadTickets(); // Refresh from storage
    
    let filteredTickets = [...mockTickets];
    
    // Apply filters (same as other methods)
    if (filters.status) {
      filteredTickets = filteredTickets.filter(t => t.status === filters.status);
    }
    
    if (filters.category) {
      filteredTickets = filteredTickets.filter(t => t.category === filters.category);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTickets = filteredTickets.filter(t => 
        t.subject.toLowerCase().includes(searchLower) || 
        t.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort tickets (same as other methods)
    if (filters.sort) {
      switch(filters.sort) {
        case 'newest':
          filteredTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'oldest':
          filteredTickets.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case 'updated':
          filteredTickets.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          break;
        case 'mostVoted':
          filteredTickets.sort((a, b) => (b.votes.up - b.votes.down) - (a.votes.up - a.votes.down));
          break;
        case 'mostCommented':
          filteredTickets.sort((a, b) => b.comments.length - a.comments.length);
          break;
        default:
          break;
      }
    }
    
    return filteredTickets;
  }
};