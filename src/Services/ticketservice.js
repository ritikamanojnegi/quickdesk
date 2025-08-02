const API_URL = 'http://localhost:5000/api';

export const ticketService = {
  async createTicket(ticketData) {
    const formData = new FormData();
    Object.keys(ticketData).forEach(key => {
      if (key === 'attachments') {
        ticketData.attachments.forEach(file => formData.append('attachments', file));
      } else {
        formData.append(key, ticketData[key]);
      }
    });

    const response = await fetch(`${API_URL}/tickets`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to create ticket');
    return await response.json();
  },

  async getTicket(id) {
    const response = await fetch(`${API_URL}/tickets/${id}`);
    if (!response.ok) throw new Error('Ticket not found');
    return await response.json();
  },

  async getUserTickets(userId, filters) {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/tickets/user/${userId}?${query}`);
    if (!response.ok) throw new Error('Failed to fetch tickets');
    return await response.json();
  },

  async getAgentTickets(agentId, filters) {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/tickets/agent/${agentId}?${query}`);
    if (!response.ok) throw new Error('Failed to fetch tickets');
    return await response.json();
  },

  async updateTicket(id, updateData) {
    const response = await fetch(`${API_URL}/tickets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    if (!response.ok) throw new Error('Failed to update ticket');
    return await response.json();
  },

  async updateTicketStatus(id, status, agentId) {
    const response = await fetch(`${API_URL}/tickets/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, agentId })
    });
    if (!response.ok) throw new Error('Failed to update status');
    return await response.json();
  },

  async addComment(ticketId, commentData) {
    const response = await fetch(`${API_URL}/tickets/${ticketId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData)
    });
    if (!response.ok) throw new Error('Failed to add comment');
    return await response.json();
  }
};