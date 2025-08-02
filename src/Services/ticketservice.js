// Real API service
const API_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return { 'Authorization': `Bearer ${user.token}` };
};

// Helper function to build query string from filters
const buildQueryString = (filters) => {
  if (!filters) return '';
  
  const params = new URLSearchParams();
  
  if (filters.status) params.append('status', filters.status);
  if (filters.category) params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (filters.sort) params.append('sort', filters.sort);
  
  return params.toString() ? `?${params.toString()}` : '';
};

export const ticketService = {
  // Get all ticket categories
  async getCategories() {
    const response = await fetch(`${API_URL}/categories`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get categories');
    }
    
    return response.json();
  },

  // Create a new ticket
  async createTicket(ticketData) {
    const response = await fetch(`${API_URL}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(ticketData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create ticket');
    }
    
    return response.json();
  },

  // Get a specific ticket by ID
  async getTicket(id) {
    const response = await fetch(`${API_URL}/tickets/${id}`, {
      headers: getAuthHeader()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get ticket');
    }
    
    return response.json();
  },

  // Get tickets for a specific user
  async getUserTickets(filters = {}) {
    const queryString = buildQueryString(filters);
    
    const response = await fetch(`${API_URL}/tickets/me${queryString}`, {
      headers: getAuthHeader()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get user tickets');
    }
    
    return response.json();
  },

  // Get tickets for agents
  async getAgentTickets(filters = {}) {
    const queryString = buildQueryString(filters);
    
    const response = await fetch(`${API_URL}/tickets/agent${queryString}`, {
      headers: getAuthHeader()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get agent tickets');
    }
    
    return response.json();
  },

  // Update ticket status
  async updateTicketStatus(id, status) {
    const response = await fetch(`${API_URL}/tickets/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update ticket status');
    }
    
    return response.json();
  },

  // Add comment to a ticket
  async addComment(ticketId, content) {
    const response = await fetch(`${API_URL}/tickets/${ticketId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ content })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add comment');
    }
    
    return response.json();
  },
  
  // Vote on a ticket
  async voteTicket(ticketId, voteType) {
    const response = await fetch(`${API_URL}/tickets/${ticketId}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ voteType })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to vote on ticket');
    }
    
    return response.json();
  },
  
  // Get all tickets (admin only)
  async getAllTickets(filters = {}) {
    const queryString = buildQueryString(filters);
    
    const response = await fetch(`${API_URL}/tickets/all${queryString}`, {
      headers: getAuthHeader()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get all tickets');
    }
    
    return response.json();
  }
};