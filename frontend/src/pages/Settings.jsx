import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useToast } from '../components/Toast.jsx';
import { useAuth } from '../store/auth.jsx';
import { useWatchlist } from '../store/watchlist.jsx';

const EXPORT_ICON = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16" fill="currentColor"><path d="M222.8,118.8l-88,88a8,8,0,0,1-11.32,0l-88-88A8,8,0,0,1,41.2,107.5L120,186.3V24A8,8,0,0,1,136,24V186.3l78.8-78.8a8,8,0,0,1,11.32,11.32Z"></path><path d="M216,224H40a8,8,0,0,1,0-16H216a8,8,0,0,1,0,16Z"></path></svg>;
const IMPORT_ICON = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16" fill="currentColor"><path d="M222.8,137.2A8,8,0,0,1,216,144l-78.8-78.8V232a8,8,0,0,1-16,0V65.2L42.4,144A8,8,0,0,1,31.2,132.8l88-88a8,8,0,0,1,11.32,0l88,88A8,8,0,0,1,222.8,137.2Z"></path><path d="M216,224H40a8,8,0,0,1,0-16H216a8,8,0,0,1,0,16Z"></path></svg>;

const ACCENT_COLORS = [
  { name: 'Blue', hex: '#0A84FF' },
  { name: 'Green', hex: '#30D158' },
  { name: 'Orange', hex: '#FF9F0A' },
  { name: 'Red', hex: '#FF453A' },
  { name: 'Pink', hex: '#FF375F' },
  { name: 'Purple', hex: '#BF5AF2' },
  { name: 'Teal', hex: '#64D2FF' },
  { name: 'Indigo', hex: '#5E5CE6' },
  { name: 'White', hex: '#FFFFFF' },
];

export default function Settings({ accentColor, setAccentColor }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('tmdb_api_key') || '');
  const {
    exportData,
    importData,
    clearAll,
    storageScopeLabel,
    watchlistPersistenceNote,
  } = useWatchlist();
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const envKey = import.meta.env.VITE_TMDB_API_KEY || '';

  const handleSaveKey = () => {
    const trimmed = apiKey.trim();
    if (trimmed) {
      localStorage.setItem('tmdb_api_key', trimmed);
      setApiKey(trimmed);
      showToast('API key saved securely', 'success');
      setTimeout(() => location.reload(), 500);
    } else {
      showToast('Please enter a valid API key', 'error');
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('tmdb_api_key');
    setApiKey('');
    showToast('API key cleared', 'info');
    setTimeout(() => location.reload(), 500);
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'movietracker_watchlist.json';
    link.click();
    URL.revokeObjectURL(url);
    showToast('Backup exported successfully', 'success');
  };

  const handleImportTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const success = importData(loadEvent.target.result);
      if (success) {
        showToast('Data imported successfully', 'success');
      } else {
        showToast('Invalid backup file format', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleClearData = () => {
    if (confirm('Are you sure? This will delete the current watchlist for this browser scope.')) {
      clearAll();
      showToast('Current watchlist cleared', 'info');
    }
  };

  return (
    <div className="settings-section fade-in">
      <h1 className="page-title" style={{ marginBottom: 'var(--space-xl)' }}>Settings</h1>

      {isAuthenticated && (
        <div className="settings-group">
          <label>Account</label>
          <p>Manage the signed-in account and the watchlist data linked to it on this browser.</p>

          <div className="account-detail-grid">
            <div>
              <span className="account-detail-label">Signed in as</span>
              <strong>{user?.email}</strong>
            </div>
            <div>
              <span className="account-detail-label">Profile name</span>
              <strong>{user?.name || 'Not set yet'}</strong>
            </div>
            <div>
              <span className="account-detail-label">Watchlist scope</span>
              <strong>{storageScopeLabel}</strong>
            </div>
            <div>
              <span className="account-detail-label">Data note</span>
              <strong>{watchlistPersistenceNote}</strong>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
            <Link to="/account/profile" className="btn btn-ghost btn-sm">View profile</Link>
            <Link to="/account/edit" className="btn btn-ghost btn-sm">Edit profile</Link>
            <Link to="/account/password" className="btn btn-ghost btn-sm">Change password</Link>
            <Link to="/account/delete" className="btn btn-danger btn-sm">Delete account</Link>
            <button className="btn btn-ghost btn-sm" onClick={() => logout({ redirectTo: '/' })}>Logout</button>
          </div>
        </div>
      )}

      {!isAuthenticated && (
        <div className="settings-group">
          <label>Account</label>
          <p>You are currently signed out. Sign in to keep your watchlist separated by account on this browser.</p>
          <div className="account-detail-grid">
            <div>
              <span className="account-detail-label">Current mode</span>
              <strong>{storageScopeLabel}</strong>
            </div>
            <div>
              <span className="account-detail-label">Data note</span>
              <strong>{watchlistPersistenceNote}</strong>
            </div>
          </div>
        </div>
      )}

      <div className="settings-group">
        <label htmlFor="api-key-input">TMDB API Key</label>
        <p>Enter your TMDB API key to access movie data. Get a free key from
          <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'underline', marginLeft: '4px' }}>themoviedb.org</a>.
        </p>
        <input
          type="text"
          className="settings-input"
          id="api-key-input"
          placeholder="Paste your API key here..."
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
        />
        <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-sm" onClick={handleSaveKey}>Save Key</button>
          {envKey && !apiKey && <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>Using key from .env</span>}
          {apiKey && <button className="btn btn-ghost btn-sm" onClick={handleClearKey}>Clear Option</button>}
        </div>
      </div>

      <div className="settings-group">
        <label>Data Management</label>
        <p>Export or import the watchlist currently active for this browser scope. {watchlistPersistenceNote}</p>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={handleExport}>
            {EXPORT_ICON} Export Backup
          </button>
          <button className="btn btn-ghost btn-sm" onClick={handleImportTrigger}>
            {IMPORT_ICON} Import Backup
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImportFile}
          />
        </div>
      </div>

      <div className="settings-group">
        <label>Accent Color</label>
        <p>Choose a highlight color for buttons, links, and interactive elements.</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 'var(--space-sm)' }}>
          {ACCENT_COLORS.map((color) => {
            const isLight = color.hex === '#FFFFFF' || color.hex === '#64D2FF';
            const isDark = color.hex === '#1C1C1E';
            return (
              <div
                key={color.hex}
                onClick={() => setAccentColor(color.hex)}
                title={color.name}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: color.hex,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: isLight ? '1.5px solid rgba(0,0,0,0.15)' : isDark ? '1.5px solid rgba(255,255,255,0.2)' : 'none',
                  boxShadow: accentColor === color.hex
                    ? `0 0 0 2px var(--glass-bg-base), 0 0 0 4px ${isLight ? 'rgba(0,0,0,0.3)' : color.hex}`
                    : '0 2px 8px rgba(0,0,0,0.2)',
                  opacity: accentColor === color.hex ? 1 : 0.55,
                  transition: 'all 200ms ease',
                  transform: accentColor === color.hex ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                {accentColor === color.hex && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isLight ? '#000' : '#fff'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="settings-group">
        <label style={{ color: 'var(--accent-danger)' }}>Danger Zone</label>
        <p>Clear the currently active watchlist from this browser. If you are signed in, this only clears the active account-scoped watchlist on this device.</p>
        <button className="btn btn-danger btn-sm" onClick={handleClearData}>Clear Current Watchlist</button>
      </div>
    </div>
  );
}
