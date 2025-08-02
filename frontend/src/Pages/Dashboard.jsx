import React, { useContext } from 'react';
import TicketList from '../Components/Ticketlist';
import { AuthContext } from '../Context/AuthContext.jsx';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{user.role === 'agent' ? 'Agent Dashboard' : 'My Tickets'}</h1>
        <Link to="/tickets/new" className="btn-primary">
          Create New Ticket
        </Link>
      </div>
      <TicketList isAgentView={user.role === 'agent'} />
    </div>
  );
};

export default Dashboard;