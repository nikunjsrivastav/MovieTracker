import React, { useState } from 'react';

import { useAuth } from '../../store/auth.jsx';

export default function DeleteAccount() {
  const { removeAccount } = useAuth();
  const [confirmation, setConfirmation] = useState('');
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canDelete = confirmation.trim().toUpperCase() === 'DELETE';

  const handleDelete = async () => {
    if (!canDelete) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      await removeAccount();
    } catch (error) {
      setApiError(error.message || 'Unable to delete your account');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="account-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Delete Account</h1>
        <p className="account-page-subtitle">
          This permanently removes your account from the backend and signs you out.
        </p>
      </div>

      <section className="account-panel danger-panel">
        <h2>Danger zone</h2>
        <p>
          Type <strong>DELETE</strong> to confirm. This action cannot be undone.
        </p>

        <label className="form-field">
          <span>Confirmation text</span>
          <input
            type="text"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder="Type DELETE"
          />
        </label>

        {apiError && <div className="form-error-banner">{apiError}</div>}

        <button
          type="button"
          className="btn btn-danger"
          onClick={handleDelete}
          disabled={!canDelete || isSubmitting}
        >
          {isSubmitting ? 'Deleting account...' : 'Delete account'}
        </button>
      </section>
    </div>
  );
}
