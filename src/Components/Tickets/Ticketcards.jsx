import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const TicketCard = ({ ticket, onClick }) => {
  return (
    <div className="ticket-card" onClick={onClick}>
      <div className="ticket-card-header">
        <h3>{ticket.subject}</h3>
        <StatusBadge status={ticket.status} />
      </div>
      <p className="ticket-description">{ticket.description.substring(0, 100)}...</p>
      <div className="ticket-meta">
        <span>#{ticket.id}</span>
        <span>{ticket.category}</span>
        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
      </div>
      <Link to={`/ticket/${ticket.id}`} className="view-details">
        View Details
      </Link>
    </div>
  );
};

export default TicketCard;