import React, { useEffect, useMemo, useState } from 'react';

import { useAuth } from '../store/auth.jsx';
const CLOSE_ICON = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" fill="currentColor"></path></svg>;
function getInitialForm(mode) {
  if (mode === 'register') {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
  }

  return {
    email: '',
    password: '',
  };
}

function validateLogin(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  }

  return errors;
}

function validateRegister(values) {
  const errors = {};

  if (values.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  }

  if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
}

export default function AuthModal() {
  const {
    authModal,
    closeAuthModal,
    login,
    register,
  } = useAuth();
  const [mode, setMode] = useState(authModal.mode);
  const [formValues, setFormValues] = useState(getInitialForm(authModal.mode));
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authModal.isOpen) {
      return;
    }

    setMode(authModal.mode);
    setFormValues(getInitialForm(authModal.mode));
    setFieldErrors({});
    setApiError('');
  }, [authModal.isOpen, authModal.mode]);

  useEffect(() => {
    if (!authModal.isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeAuthModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [authModal.isOpen, closeAuthModal]);

  const title = useMemo(
    () => (mode === 'login' ? 'Welcome back' : 'Create your account'),
    [mode],
  );

  if (!authModal.isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
    setFieldErrors((current) => ({
      ...current,
      [name]: '',
    }));
    setApiError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = mode === 'login'
      ? validateLogin(formValues)
      : validateRegister(formValues);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      if (mode === 'login') {
        await login({
          email: formValues.email,
          password: formValues.password,
        });
      } else {
        await register({
          name: formValues.name.trim(),
          email: formValues.email,
          password: formValues.password,
        });
      }
    } catch (error) {
      setApiError(error.message || 'Unable to complete this request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-modal-backdrop" onClick={closeAuthModal}>
      <div
        className="auth-modal-card"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="auth-modal-close"
          onClick={(event) => {
            event.stopPropagation();
            closeAuthModal();
          }}
          aria-label="Close authentication dialog"
        >
          <span aria-hidden="true">{CLOSE_ICON}</span>
        </button>

        <div className="auth-modal-header">
          <span className="auth-kicker">MovieTracker Account</span>
          <h2>{title}</h2>
          <p>
            {mode === 'login'
              ? 'Sign in to manage your profile and account settings.'
              : 'Register once, then we will sign you in automatically.'}
          </p>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setFormValues(getInitialForm('login'));
              setFieldErrors({});
              setApiError('');
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register');
              setFormValues(getInitialForm('register'));
              setFieldErrors({});
              setApiError('');
            }}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label className="form-field">
              <span>Name</span>
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                placeholder="Your name"
              />
              {fieldErrors.name && <small className="field-error">{fieldErrors.name}</small>}
            </label>
          )}

          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {fieldErrors.email && <small className="field-error">{fieldErrors.email}</small>}
          </label>

          <label className="form-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder={mode === 'login' ? 'Your password' : 'At least 8 characters'}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            {fieldErrors.password && <small className="field-error">{fieldErrors.password}</small>}
          </label>

          {mode === 'register' && (
            <label className="form-field">
              <span>Confirm password</span>
              <input
                type="password"
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                autoComplete="new-password"
              />
              {fieldErrors.confirmPassword && (
                <small className="field-error">{fieldErrors.confirmPassword}</small>
              )}
            </label>
          )}

          {apiError && <div className="form-error-banner">{apiError}</div>}

          <button type="submit" className="btn btn-primary auth-submit-btn" disabled={isSubmitting}>
            {isSubmitting
              ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
              : (mode === 'login' ? 'Login' : 'Register and login')}
          </button>
        </form>
      </div>
    </div>
  );
}
