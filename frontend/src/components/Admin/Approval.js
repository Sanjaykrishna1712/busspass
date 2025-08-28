// Approval.js
import React, { useState } from 'react';
import './Approval.css';

const Approval = () => {
  const [requests] = useState([
    { id: 1, user: 'Alex Johnson', requestType: 'Document Upload', date: '2023-06-15', status: 'Pending' },
    { id: 2, user: 'Maria Garcia', requestType: 'Access Request', date: '2023-06-14', status: 'Approved' },
    { id: 3, user: 'David Kim', requestType: 'Content Publication', date: '2023-06-13', status: 'Rejected' },
    { id: 4, user: 'Sarah Miller', requestType: 'Account Upgrade', date: '2023-06-12', status: 'Pending' },
    { id: 5, user: 'James Wilson', requestType: 'Permission Change', date: '2023-06-11', status: 'Pending' },
  ]);

  const [filter, setFilter] = useState('All');

  const filteredRequests = filter === 'All' 
    ? requests 
    : requests.filter(req => req.status === filter);

  const handleApprove = (id) => {
    alert(`Approved request #${id}`);
  };

  const handleReject = (id) => {
    alert(`Rejected request #${id}`);
  };

  return (
    <div className="approval-container">
      <div className="approval-header">
        <h3>Pending Approvals</h3>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'All' ? 'active' : ''}`}
            onClick={() => setFilter('All')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'Pending' ? 'active' : ''}`}
            onClick={() => setFilter('Pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${filter === 'Approved' ? 'active' : ''}`}
            onClick={() => setFilter('Approved')}
          >
            Approved
          </button>
          <button 
            className={`filter-btn ${filter === 'Rejected' ? 'active' : ''}`}
            onClick={() => setFilter('Rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      <div className="approval-cards">
        {filteredRequests.map(request => (
          <div key={request.id} className="approval-card">
            <div className="card-header">
              <div className="user-info">
                <img src={`https://ui-avatars.com/api/?name=${request.user}&background=random`} alt={request.user} />
                <div>
                  <div className="user-name">{request.user}</div>
                  <div className="request-date">{request.date}</div>
                </div>
              </div>
              <span className={`status status-${request.status.toLowerCase()}`}>
                {request.status}
              </span>
            </div>
            
            <div className="card-body">
              <h4>{request.requestType}</h4>
              <p>Request for {request.requestType.toLowerCase()} needs review and approval.</p>
            </div>
            
            <div className="card-footer">
              <div className="request-id">ID: #{request.id}</div>
              {request.status === 'Pending' && (
                <div className="action-buttons">
                  <button 
                    className="btn-reject"
                    onClick={() => handleReject(request.id)}
                  >
                    Reject
                  </button>
                  <button 
                    className="btn-approve"
                    onClick={() => handleApprove(request.id)}
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="empty-state">
          <i className="fas fa-clipboard-check"></i>
          <h3>No requests found</h3>
          <p>There are no {filter.toLowerCase()} requests at this time.</p>
        </div>
      )}
    </div>
  );
};

export default Approval;