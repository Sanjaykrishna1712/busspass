// AdminDashboard.js
import React, { useState } from 'react';
import Users from './Users';
import Approval from './Approval';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    // Logout logic here
    alert('Logout successful!');
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="sidebar-menu">
          <div 
            className={`menu-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('users');
              setSidebarOpen(false);
            }}
          >
            <i className="fas fa-users"></i>
            <span>User Management</span>
          </div>
          <div 
            className={`menu-item ${activeTab === 'approval' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('approval');
              setSidebarOpen(false);
            }}
          >
            <i className="fas fa-clipboard-check"></i>
            <span>Approval System</span>
          </div>
          <div className="menu-item">
            <i className="fas fa-chart-bar"></i>
            <span>Analytics</span>
          </div>
          <div className="menu-item">
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="admin-header">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
              <i className="fas fa-bars"></i>
            </button>
            <h1>Admin Dashboard</h1>
          </div>
          <div className="header-right">
            <div className="admin-profile">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=4361ee&color=fff" alt="Admin" />
              <span>Admin User</span>
            </div>
            <button className="btn btn-logout" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </header>
        
        {/* Content */}
        <div className="dashboard-content">
          <div className="content-header">
            <h2>{activeTab === 'users' ? 'User Management' : 'Approval System'}</h2>
            <div className="breadcrumb">
              <span>Dashboard</span>
              <i className="fas fa-chevron-right"></i>
              <span>{activeTab === 'users' ? 'Users' : 'Approval'}</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <i className="fas fa-users"></i>
              Users
            </button>
            <button 
              className={`tab-btn ${activeTab === 'approval' ? 'active' : ''}`}
              onClick={() => setActiveTab('approval')}
            >
              <i className="fas fa-clipboard-check"></i>
              Approval
            </button>
          </div>
          
          {/* Main Content Area */}
          <div className="main-content-area">
            {activeTab === 'users' ? <Users /> : <Approval />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;