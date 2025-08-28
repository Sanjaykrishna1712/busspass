// Dashboard.js (corrected)
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard-content">
      <div className="welcome-card">
        <h2>Welcome, {user?.name}</h2>
        <p className="user-type">{user?.user_type}</p>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Current Pass</h3>
            <p>Active until 12/31/2023</p>
            <button className="view-pass" onClick={() => navigate("/pass")}>View Pass</button>
          </div>
          
          <div className="stat-card">
            <h3>Recent Trips</h3>
            <p>5 trips this week</p>
            <button className="view-history" onClick={() => navigate("/history")}>View History</button>
          </div>
        </div>
      </div>
      
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn renew-btn">Renew Pass</button>
          <button className="action-btn report-btn">Report Issue</button>
          <button className="action-btn help-btn">Get Help</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;