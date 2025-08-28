import React from 'react';
import { Link } from 'react-router-dom';
import './loged.css';

function ConductorLogin() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Conductor Login</h2>
        <form className="auth-form">
          <div className="form-group">
            <label htmlFor="conductor-id">Conductor ID</label>
            <input type="text" id="conductor-id" placeholder="Enter your conductor ID" />
          </div>
          <div className="form-group">
            <label htmlFor="conductor-password">Password</label>
            <input type="password" id="conductor-password" placeholder="Enter your password" />
          </div>
          <button type="submit" className="btn btn-primary">Login as Conductor</button>
        </form>
        <p className="auth-link">
          <Link to="/">Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default ConductorLogin;