import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext.jsx';
import { ticketService } from '../../Services/ticketservice.js';
import LoadingSpinner from '../UI/Loadingspinner.jsx';

const CreateTicket = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState('');
  const [ticketData, setTicketData] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'Medium',
    attachments: []
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const categoriesData = await ticketService.getCategories();
        setCategories(categoriesData);
        if (categoriesData.length > 0) {
          setTicketData(prev => ({ ...prev, category: categoriesData[0] }));
        }
      } catch (err) {
        setError('Failed to load categories. Please try again.');
        console.error(err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newTicket = await ticketService.createTicket({
        ...ticketData,
        userId: user.id
      });
      navigate(`/tickets/${newTicket.id}`);
    } catch (err) {
      setError('Failed to create ticket. Please try again.');
      console.error(err);
      setLoading(false);
    }
  };

  if (categoriesLoading) return <LoadingSpinner />;

  return (
    <div className="create-ticket">
      <h1>Create New Ticket</h1>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={ticketData.subject}
            onChange={handleChange}
            required
            placeholder="Brief description of the issue"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={ticketData.category}
            onChange={handleChange}
            required
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={ticketData.priority}
            onChange={handleChange}
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={ticketData.description}
            onChange={handleChange}
            required
            placeholder="Detailed description of the issue"
            rows="6"
          />
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <LoadingSpinner small /> : 'Create Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;