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
  { name: 'Teal', hex: '#0D9488' },
  { name: 'Indigo', hex: '#5E5CE6' },
  { name: 'Lime', hex: '#A3E635' },
  { name: 'Gold', hex: '#FFD60A' },
  { name: 'Coral', hex: '#FF7A59' },
  { name: 'Mint', hex: '#2DD4BF' },
  { name: 'Sky', hex: '#38BDF8' },
  { name: 'Peach', hex: '#FDBA74' },
  { name: 'Sand', hex: '#D4A373' },
  { name: 'Lavender', hex: '#C4B5FD' },
  { name: 'Rose', hex: '#FDA4AF' },
  { name: 'Butter', hex: '#FDE68A' },
  { name: 'Silver', hex: '#CBD5E1' },
  { name: 'YInMn Blue', hex: '#2E5090' },
];

export default function Settings({ accentColor, setAccentColor, shuffleBackground, borderRadius, setBorderRadius }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('tmdb_api_key') || '');
  const {
    exportData,
    importData,
    clearAll,
    storageScopeLabel,
    watchlistPersistenceNote,
  } = useWatchlist();
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
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
      <h1 className="page-title">Settings</h1>

      {isAuthenticated && (
        <div className="settings-group" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ height: '100px', background: 'linear-gradient(135deg, var(--accent-primary) 0%, rgba(255,255,255,0.05) 100%)', opacity: 0.4 }}></div>
          
          <div style={{ padding: 'var(--space-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginTop: '-50px', marginBottom: 'var(--space-lg)' }}>
              <div style={{
                width: '76px', height: '76px', borderRadius: '50%', border: '4px solid #161618',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 'bold', color: '#fff',
                background: 'linear-gradient(135deg, var(--accent-primary), color-mix(in srgb, var(--accent-primary) 55%, white))',
                zIndex: 2
              }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || '?'}
              </div>
              <div style={{ flex: 1, marginTop: '30px' }}>
                <h3 style={{ margin: 0, fontSize: 'var(--font-lg)' }}>{user?.name || 'Not set yet'}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>{user?.email}</p>
              </div>
              <div style={{ marginTop: '30px' }}>
                <Link to="/account/edit" className="btn btn-primary btn-sm">Edit</Link>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>Full Name</label>
                <div style={{ background: 'var(--glass-bg-hover)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-sm)', color: 'var(--text-primary)', border: '1px solid transparent' }}>
                  {user?.name || 'Not set yet'}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>Member Since</label>
                <div style={{ background: 'var(--glass-bg-hover)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-sm)', color: 'var(--text-primary)', border: '1px solid transparent' }}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '--'}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>Last Updated</label>
                <div style={{ background: 'var(--glass-bg-hover)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-sm)', color: 'var(--text-primary)', border: '1px solid transparent' }}>
                  {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '--'}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>Watchlist Scope</label>
                <div style={{ background: 'var(--glass-bg-hover)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-sm)', color: 'var(--text-primary)', border: '1px solid transparent' }}>
                  {storageScopeLabel}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span>{watchlistPersistenceNote}</span>
            </div>

            <div style={{ marginTop: 'var(--space-lg)' }}>
              <h4 style={{ fontSize: 'var(--font-sm)', marginBottom: '12px', fontWeight: 600 }}>My email Address</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'color-mix(in srgb, var(--accent-primary) 15%, transparent)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-sm)', fontWeight: '600' }}>{user?.email}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Primary Email</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-lg)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
              <Link to="/account/password" className="btn btn-ghost btn-sm">Change password</Link>
              <button className="btn btn-ghost btn-sm" onClick={() => logout({ redirectTo: '/' })}>Logout</button>
              <Link to="/account/delete" className="btn btn-danger btn-sm" style={{ marginLeft: 'auto' }}>Delete account</Link>
            </div>
          </div>
        </div>
      )}

      {!isAuthenticated && (
        <div className="settings-group" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ height: '100px', background: 'linear-gradient(135deg, var(--glass-border-hover) 0%, rgba(255,255,255,0.02) 100%)', opacity: 0.5 }}></div>
          
          <div style={{ padding: 'var(--space-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginTop: '-50px', marginBottom: 'var(--space-lg)' }}>
              <div style={{
                width: '76px', height: '76px', borderRadius: '50%', border: '4px solid #161618',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)',
                background: 'var(--glass-bg-base)', zIndex: 2
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div style={{ flex: 1, marginTop: '30px' }}>
                <h3 style={{ margin: 0, fontSize: 'var(--font-lg)' }}>Guest Mode</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>Not signed in</p>
              </div>
              <div style={{ marginTop: '30px' }}>
                <button className="btn btn-primary btn-sm" onClick={() => openAuthModal('login', { redirectTo: '/settings' })}>Login</button>
              </div>
            </div>

            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
              You are currently signed out. Sign in to keep your watchlist separated by account and synced across your devices.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>Current Mode</label>
                <div style={{ background: 'var(--glass-bg-hover)', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-sm)', color: 'var(--text-primary)', border: '1px solid transparent' }}>
                  {storageScopeLabel}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span>{watchlistPersistenceNote}</span>
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
        <p>Choose a highlight color for interactive elements and let the ambient gradient wallpaper remix around it.</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: 'var(--space-sm)' }}>
          {ACCENT_COLORS.map((color) => {
            const normalizedHex = color.hex.replace('#', '');
            const red = parseInt(normalizedHex.slice(0, 2), 16);
            const green = parseInt(normalizedHex.slice(2, 4), 16);
            const blue = parseInt(normalizedHex.slice(4, 6), 16);
            const isLight = ((0.299 * red) + (0.587 * green) + (0.114 * blue)) / 255 > 0.62;
            const isDark = color.hex === '#1C1C1E';
            return (
              <div
                key={color.hex}
                onClick={() => {
                  setAccentColor(color.hex);
                  shuffleBackground();
                }}
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
        <div style={{ marginTop: 'var(--space-md)' }}>
          <button className="btn btn-ghost" style={{ padding: '0.8rem 1.35rem' }} onClick={shuffleBackground}>Shuffle Ambient Wallpaper</button>
        </div>
      </div>

      <div className="settings-group">
        <label>Border Radius</label>
        <p>Adjust the roundness of the interface elements.</p>
        <div style={{ marginTop: 'var(--space-md)', maxWidth: '400px' }}>
          <input 
            type="range" 
            min="0" 
            max="2" 
            step="0.1" 
            value={borderRadius} 
            onChange={(e) => setBorderRadius(parseFloat(e.target.value))} 
            style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer', marginBottom: '8px' }}
          />
          <div style={{ position: 'relative', height: '28px', margin: '0 8px' }}>
            <div style={{ position: 'absolute', left: '0%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '2px', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}></div>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Sharp</span>
            </div>
            <div style={{ position: 'absolute', left: '25%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '2px', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}></div>
            </div>
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '2px', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}></div>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Default</span>
            </div>
            <div style={{ position: 'absolute', left: '75%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '2px', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}></div>
            </div>
            <div style={{ position: 'absolute', left: '100%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '2px', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}></div>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>Round</span>
            </div>
          </div>
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
