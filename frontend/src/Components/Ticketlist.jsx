import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext.jsx';
import { ticketService } from '../Services/ticketservice.js';
import LoadingSpinner from './UI/Loadingspinner.jsx';

const TicketList = ({ isAgentView = false }) => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: '',
    sort: 'newest'
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await ticketService.getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError('');
      try {
        let ticketsData;
        if (isAgentView) {
          // For agents, fetch all tickets or assigned tickets
          ticketsData = await ticketService.getAgentTickets(user.id, filters);
        } else {
          // For regular users, fetch only their tickets
          ticketsData = await ticketService.getUserTickets(user.id, filters);
        }
        setTickets(ticketsData);
      } catch (err) {
        setError('Failed to load tickets. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user.id, isAgentView, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'open': return 'status-open';
      case 'in progress': return 'status-in-progress';
      case 'resolved': return 'status-resolved';
      case 'closed': return 'status-closed';
      default: return '';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="ticket-list">
      <div className="ticket-filters">
        <div className="ticket-search">
          <input
            type="text"
            name="search"
            placeholder="Search tickets..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        
        <div className="ticket-filter-select">
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        
        <div className="ticket-filter-select">
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
        </div>
        
        <div className="ticket-filter-select">
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="updated">Recently Updated</option>
            <option value="mostVoted">Most Voted</option>
            <option value="mostCommented">Most Commented</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {tickets.length === 0 ? (
        <div className="empty-state">
          <p>No tickets found. {!isAgentView && 'Create a new ticket to get started.'}</p>
        </div>
      ) : (
        <table className="ticket-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Category</th>
              <th>Status</th>
              <th>Created</th>
              <th>Updated</th>
              {isAgentView && <th>Created By</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id}>
                <td>#{ticket.id}</td>
                <td>{ticket.subject}</td>
                <td>{ticket.category.name}</td>
                <td>
                  <span className={`ticket-status ${getStatusClass(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td>{formatDate(ticket.createdAt)}</td>
                <td>{formatDate(ticket.updatedAt)}</td>
                {isAgentView && <td>User #{ticket.createdBy}</td>}
                <td>
                  <Link to={`/tickets/${ticket.id}`} className="btn-primary">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TicketList;