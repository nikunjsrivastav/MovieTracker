import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../store/auth.jsx';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isAuthReady, openAuthModal } = useAuth();

  useEffect(() => {
    if (!isAuthReady || isAuthenticated) {
      return;
    }

    openAuthModal('login', {
      redirectTo: `${location.pathname}${location.search}${location.hash}`,
    });
  }, [isAuthReady, isAuthenticated, location, openAuthModal]);

  if (!isAuthReady) {
    return (
      <div className="empty-state fade-in">
        <h3>Checking your session...</h3>
        <p>We are verifying your account before opening this page.</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
