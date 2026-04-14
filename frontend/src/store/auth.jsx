import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  clearStoredAuthToken,
  deleteCurrentUser,
  fetchCurrentUser,
  getStoredAuthToken,
  loginUser,
  registerUser,
  setStoredAuthToken,
  updateCurrentUser,
} from '../api/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: 'login',
    redirectTo: null,
  });

  useEffect(() => {
    const token = getStoredAuthToken();

    if (!token) {
      setStatus('unauthenticated');
      return;
    }

    let active = true;

    fetchCurrentUser(token)
      .then((response) => {
        if (!active) return;
        setUser(response.user);
        setStatus('authenticated');
      })
      .catch(() => {
        if (!active) return;
        clearStoredAuthToken();
        setUser(null);
        setStatus('unauthenticated');
      });

    return () => {
      active = false;
    };
  }, []);

  const openAuthModal = (mode = 'login', options = {}) => {
    setAuthModal({
      isOpen: true,
      mode,
      redirectTo: options.redirectTo || null,
    });
  };

  const closeAuthModal = () => {
    setAuthModal((current) => ({
      ...current,
      isOpen: false,
    }));
  };

  const finishAuthentication = ({ token, user: nextUser, redirectTo }) => {
    setStoredAuthToken(token);
    setUser(nextUser);
    setStatus('authenticated');
    setAuthModal({
      isOpen: false,
      mode: 'login',
      redirectTo: null,
    });

    if (redirectTo) {
      navigate(redirectTo);
    }
  };

  const login = async (credentials, options = {}) => {
    const result = await loginUser(credentials);
    finishAuthentication({
      ...result,
      redirectTo: options.redirectTo ?? authModal.redirectTo,
    });
    return result.user;
  };

  const register = async (payload, options = {}) => {
    await registerUser(payload);
    return login(
      {
        email: payload.email,
        password: payload.password,
      },
      options,
    );
  };

  const refreshUser = async () => {
    const token = getStoredAuthToken();

    if (!token) {
      setUser(null);
      setStatus('unauthenticated');
      return null;
    }

    const response = await fetchCurrentUser(token);
    setUser(response.user);
    setStatus('authenticated');
    return response.user;
  };

  const saveProfile = async (updates) => {
    const response = await updateCurrentUser(updates);
    setUser(response.user);
    return response.user;
  };

  const logout = (options = {}) => {
    clearStoredAuthToken();
    setUser(null);
    setStatus('unauthenticated');
    setAuthModal({
      isOpen: false,
      mode: 'login',
      redirectTo: null,
    });

    if (options.redirectTo) {
      navigate(options.redirectTo);
    }
  };

  const removeAccount = async () => {
    await deleteCurrentUser();
    logout({ redirectTo: '/' });
  };

  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authenticated',
      isAuthReady: status !== 'loading',
      authModal,
      openAuthModal,
      closeAuthModal,
      login,
      register,
      logout,
      refreshUser,
      saveProfile,
      removeAccount,
    }),
    [user, status, authModal],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
