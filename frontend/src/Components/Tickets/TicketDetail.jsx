import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext.jsx';
import { ticketService } from '../../Services/ticketservice.js';
import LoadingSpinner from '../UI/Loadingspinner.jsx';
import CommentSection from './CommentSection';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      setLoading(true);
      try {
        const ticketData = await ticketService.getTicket(id);
        setTicket(ticketData);
      } catch (err) {
        setError('Failed to load ticket details. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setStatusLoading(true);
    try {
      const updatedTicket = await ticketService.updateTicketStatus(
        id, 
        newStatus, 
        user.role === 'agent' || user.role === 'admin' ? user.id : null
      );
      setTicket(updatedTicket);
    } catch (err) {
      setError('Failed to update ticket status. Please try again.');
      console.error(err);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleVote = async (voteType) => {
    try {
      const updatedTicket = await ticketService.voteTicket(id, voteType, user.id);
      setTicket(updatedTicket);
    } catch (err) {
      setError('Failed to register vote. Please try again.');
      console.error(err);
    }
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

  const handleCommentAdded = (newComment) => {
    setTicket(prev => ({
      ...prev,
      comments: [...prev.comments, newComment]
    }));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!ticket) return <div className="error-message">Ticket not found</div>;

  return (
    <div className="ticket-detail">
      <div className="ticket-detail-header">
        <div>
          <h1>Ticket #{ticket.id}: {ticket.subject}</h1>
          <span className={`ticket-status ${getStatusClass(ticket.status)}`}>
            {ticket.status}
          </span>
        </div>
        <div className="vote-buttons">
          <button 
            className="vote-button" 
            onClick={() => handleVote('up')}
            aria-label="Upvote"
          >
            👍 <span className="vote-count">{ticket.votes.up}</span>
          </button>
          <button 
            className="vote-button" 
            onClick={() => handleVote('down')}
            aria-label="Downvote"
          >
            👎 <span className="vote-count">{ticket.votes.down}</span>
          </button>
        </div>
      </div>

      <div className="ticket-meta">
        <div className="ticket-meta-item">
          <span className="ticket-meta-label">Category</span>
          <span className="ticket-meta-value">{ticket.category}</span>
        </div>
        <div className="ticket-meta-item">
          <span className="ticket-meta-label">Priority</span>
          <span className="ticket-meta-value">{ticket.priority}</span>
        </div>
        <div className="ticket-meta-item">
          <span className="ticket-meta-label">Created</span>
          <span className="ticket-meta-value">{formatDate(ticket.createdAt)}</span>
        </div>
        <div className="ticket-meta-item">
          <span className="ticket-meta-label">Last Updated</span>
          <span className="ticket-meta-value">{formatDate(ticket.updatedAt)}</span>
        </div>
        <div className="ticket-meta-item">
          <span className="ticket-meta-label">Assigned To</span>
          <span className="ticket-meta-value">
            {ticket.assignedTo ? `Agent #${ticket.assignedTo}` : 'Unassigned'}
          </span>
        </div>
      </div>

      <div className="ticket-description">
        <h2>Description</h2>
        <p>{ticket.description}</p>
      </div>

      {(user.role === 'agent' || user.role === 'admin') && (
        <div className="ticket-actions">
          <h3>Update Status</h3>
          {statusLoading ? (
            <LoadingSpinner small />
          ) : (
            <div className="status-buttons">
              <button 
                onClick={() => handleStatusChange('Open')} 
                disabled={ticket.status === 'Open'}
                className={ticket.status === 'Open' ? 'active' : ''}
              >
                Open
              </button>
              <button 
                onClick={() => handleStatusChange('In Progress')} 
                disabled={ticket.status === 'In Progress'}
                className={ticket.status === 'In Progress' ? 'active' : ''}
              >
                In Progress
              </button>
              <button 
                onClick={() => handleStatusChange('Resolved')} 
                disabled={ticket.status === 'Resolved'}
                className={ticket.status === 'Resolved' ? 'active' : ''}
              >
                Resolved
              </button>
              <button 
                onClick={() => handleStatusChange('Closed')} 
                disabled={ticket.status === 'Closed'}
                className={ticket.status === 'Closed' ? 'active' : ''}
              >
                Closed
              </button>
            </div>
          )}
        </div>
      )}

      <CommentSection 
        ticketId={ticket.id} 
        comments={ticket.comments} 
        onCommentAdded={handleCommentAdded} 
      />

      <div className="back-button">
        <button onClick={() => navigate(-1)}>Back to Tickets</button>
      </div>
    </div>
  );
};

export default TicketDetail;