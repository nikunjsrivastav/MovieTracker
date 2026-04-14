import React, { useState } from 'react';

import { useToast } from '../../components/Toast.jsx';
import { useAuth } from '../../store/auth.jsx';

export default function ChangePassword() {
  const { saveProfile } = useAuth();
  const { showToast } = useToast();
  const [values, setValues] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: value,
    }));
    setErrors((current) => ({
      ...current,
      [name]: '',
    }));
    setApiError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!values.currentPassword) {
      nextErrors.currentPassword = 'Current password is required';
    }

    if (values.password.length < 8) {
      nextErrors.password = 'New password must be at least 8 characters long';
    }

    if (values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSaving(true);
    setApiError('');

    try {
      await saveProfile({
        currentPassword: values.currentPassword,
        password: values.password,
      });
      setValues({
        currentPassword: '',
        password: '',
        confirmPassword: '',
      });
      showToast('Password updated successfully', 'success');
    } catch (error) {
      setApiError(error.message || 'Unable to change password');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="account-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Change Password</h1>
        <p className="account-page-subtitle">
          Enter your current password before setting a new one.
        </p>
      </div>

      <form className="account-panel account-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Current password</span>
          <input
            type="password"
            name="currentPassword"
            value={values.currentPassword}
            onChange={handleChange}
            autoComplete="current-password"
          />
          {errors.currentPassword && <small className="field-error">{errors.currentPassword}</small>}
        </label>

        <label className="form-field">
          <span>New password</span>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {errors.password && <small className="field-error">{errors.password}</small>}
        </label>

        <label className="form-field">
          <span>Confirm new password</span>
          <input
            type="password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {errors.confirmPassword && <small className="field-error">{errors.confirmPassword}</small>}
        </label>

        {apiError && <div className="form-error-banner">{apiError}</div>}

        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {isSaving ? 'Updating password...' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
