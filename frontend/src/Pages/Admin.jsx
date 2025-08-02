import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ticketService } from '../Services/ticketservice.js';
import LoadingSpinner from '../Components/UI/Loadingspinner.jsx';
import UserManagement from '../Components/Admin/UserManagement.jsx';
import CategoryManagement from '../Components/Admin/CategoryManagement.jsx';

const AdminDashboard = () => {
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
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ticketsData, categoriesData] = await Promise.all([
          ticketService.getAllTickets(filters),
          ticketService.getCategories()
        ]);
        setTickets(ticketsData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to load admin data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Tickets</h3>
          <p className="stat-value">{tickets.length}</p>
        </div>
        <div className="stat-card">
          <h3>Open Tickets</h3>
          <p className="stat-value">
            {tickets.filter(t => t.status === 'Open').length}
          </p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p className="stat-value">
            {tickets.filter(t => t.status === 'In Progress').length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Resolved</h3>
          <p className="stat-value">
            {tickets.filter(t => t.status === 'Resolved').length}
          </p>
        </div>
      </div>

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
              <option key={category} value={category}>{category}</option>
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

      {tickets.length === 0 ? (
        <div className="empty-state">
          <p>No tickets found.</p>
        </div>
      ) : (
        <table className="ticket-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Category</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Assigned To</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id}>
                <td>#{ticket.id}</td>
                <td>{ticket.subject}</td>
                <td>{ticket.category}</td>
                <td>
                  <span className={`ticket-status ${getStatusClass(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td>User #{ticket.createdBy}</td>
                <td>{ticket.assignedTo ? `Agent #${ticket.assignedTo}` : 'Unassigned'}</td>
                <td>{formatDate(ticket.createdAt)}</td>
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

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/admin') {
      navigate('/admin/dashboard');
    }
  }, [location, navigate]);

  return (
    <div className="admin-panel">
      <div className="admin-sidebar">
        <h2>Admin</h2>
        <ul>
          <li>
            <Link to="/admin/dashboard" className={location.pathname === '/admin/dashboard' ? 'active' : ''}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className={location.pathname === '/admin/users' ? 'active' : ''}>
              User Management
            </Link>
          </li>
          <li>
            <Link to="/admin/categories" className={location.pathname === '/admin/categories' ? 'active' : ''}>
              Categories
            </Link>
          </li>
        </ul>
      </div>
      
      <div className="admin-content">
        <Routes>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;