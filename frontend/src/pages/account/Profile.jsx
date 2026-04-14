import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../store/auth.jsx';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="account-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Your Profile</h1>
        <p className="account-page-subtitle">
          Review the account details currently stored on the server.
        </p>
      </div>

      <section className="account-panel">
        <div className="account-avatar-large">
          {(user?.name || user?.email || '?').charAt(0).toUpperCase()}
        </div>
        <div className="account-profile-copy">
          <h2>{user?.name || 'Unnamed member'}</h2>
          <p>{user?.email}</p>
        </div>
      </section>

      <section className="account-panel">
        <div className="account-detail-grid">
          <div>
            <span className="account-detail-label">Name</span>
            <strong>{user?.name || 'Not set yet'}</strong>
          </div>
          <div>
            <span className="account-detail-label">Email</span>
            <strong>{user?.email}</strong>
          </div>
          <div>
            <span className="account-detail-label">Member since</span>
            <strong>{user?.createdAt ? new Date(user.createdAt).toLocaleString() : '--'}</strong>
          </div>
          <div>
            <span className="account-detail-label">Last updated</span>
            <strong>{user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : '--'}</strong>
          </div>
        </div>
      </section>

      <section className="account-panel account-actions-panel">
        <Link to="/account/edit" className="btn btn-primary">Edit profile</Link>
        <Link to="/account/password" className="btn btn-ghost">Change password</Link>
        <Link to="/settings" className="btn btn-ghost">Settings</Link>
      </section>
    </div>
  );
}
