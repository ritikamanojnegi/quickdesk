import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext.jsx';
import Navbar from './Components/UI/Navbar';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import PrivateRoute from './Components/UI/PrivateRoute.jsx';
import Admin from './Pages/Admin';
import CreateTicket from './Components/Tickets/CreateTicket';
import TicketDetail from './Components/Tickets/TicketDetail';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="app-container">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            
            <Route path="/tickets/new" element={
              <PrivateRoute>
                <CreateTicket />
              </PrivateRoute>
            } />
            
            <Route path="/tickets/:id" element={
              <PrivateRoute>
                <TicketDetail />
              </PrivateRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/admin/*" element={
              <PrivateRoute adminOnly={true}>
                <Admin />
              </PrivateRoute>
            } />
            
            {/* 404 route */}
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
