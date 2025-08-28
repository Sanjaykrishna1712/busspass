// PassInfo.js
import React from 'react';
import './PassInfo.css';

const PassInfo = () => {
  const pass = {
    id: 'SBP-2025-00123',
    type: 'Monthly',
    zone: 'City Zone A',
    valid_from: '2025-08-01',
    valid_to: '2025-08-31',
    status: 'Active',
    qr_url: '',
  };

  return (
    <div className="passinfo-content">
      <div className="pass-card">
        <h2>My Bus Pass</h2>
        <div className="pass-grid">
          <div className="field">
            <span className="label">Pass ID</span>
            <span className="value">{pass.id}</span>
          </div>
          <div className="field">
            <span className="label">Type</span>
            <span className="value">{pass.type}</span>
          </div>
          <div className="field">
            <span className="label">Zone</span>
            <span className="value">{pass.zone}</span>
          </div>
          <div className="field">
            <span className="label">Valid From</span>
            <span className="value">{pass.valid_from}</span>
          </div>
          <div className="field">
            <span className="label">Valid To</span>
            <span className="value">{pass.valid_to}</span>
          </div>
          <div className="field">
            <span className="label">Status</span>
            <span className={`badge ${pass.status === 'Active' ? 'active' : 'expired'}`}>
              {pass.status}
            </span>
          </div>
        </div>

        <div className="pass-actions">
          <button className="btn primary">Download PDF</button>
          <button className="btn outline">Renew</button>
        </div>
      </div>
    </div>
  );
};

export default PassInfo;