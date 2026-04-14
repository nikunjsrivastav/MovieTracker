import React, { useState } from 'react';

import { useToast } from '../../components/Toast.jsx';
import { useAuth } from '../../store/auth.jsx';

export default function EditProfile() {
  const { user, saveProfile } = useAuth();
  const { showToast } = useToast();
  const [values, setValues] = useState({
    name: user?.name || '',
    email: user?.email || '',
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

    if (values.name.trim().length < 2) {
      nextErrors.name = 'Name must be at least 2 characters long';
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Email is required';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSaving(true);
    setApiError('');

    try {
      await saveProfile({
        name: values.name.trim(),
        email: values.email.trim(),
      });
      showToast('Profile updated', 'success');
    } catch (error) {
      setApiError(error.message || 'Unable to update your profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="account-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Edit Profile</h1>
        <p className="account-page-subtitle">
          Update the personal details attached to your account.
        </p>
      </div>

      <form className="account-panel account-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Name</span>
          <input type="text" name="name" value={values.name} onChange={handleChange} />
          {errors.name && <small className="field-error">{errors.name}</small>}
        </label>

        <label className="form-field">
          <span>Email</span>
          <input type="email" name="email" value={values.email} onChange={handleChange} />
          {errors.email && <small className="field-error">{errors.email}</small>}
        </label>

        {apiError && <div className="form-error-banner">{apiError}</div>}

        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
