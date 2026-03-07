import React, { useState, useRef } from 'react';
import { useToast } from '../components/Toast.jsx';
import { useWatchlist } from '../store/watchlist.jsx';

const EXPORT_ICON = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16" fill="currentColor"><path d="M222.8,118.8l-88,88a8,8,0,0,1-11.32,0l-88-88A8,8,0,0,1,41.2,107.5L120,186.3V24A8,8,0,0,1,136,24V186.3l78.8-78.8a8,8,0,0,1,11.32,11.32Z"></path><path d="M216,224H40a8,8,0,0,1,0-16H216a8,8,0,0,1,0,16Z"></path></svg>;
const IMPORT_ICON = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16" fill="currentColor"><path d="M222.8,137.2A8,8,0,0,1,216,144l-78.8-78.8V232a8,8,0,0,1-16,0V65.2L42.4,144A8,8,0,0,1,31.2,132.8l88-88a8,8,0,0,1,11.32,0l88,88A8,8,0,0,1,222.8,137.2Z"></path><path d="M216,224H40a8,8,0,0,1,0-16H216a8,8,0,0,1,0,16Z"></path></svg>;

export default function Settings() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('tmdb_api_key') || '');
  const { exportData, importData, clearAll } = useWatchlist();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  
  const envKey = import.meta.env.VITE_TMDB_API_KEY || '';

  const handleSaveKey = () => {
    const trimmed = apiKey.trim();
    if (trimmed) {
      localStorage.setItem('tmdb_api_key', trimmed);
      setApiKey(trimmed);
      showToast('API key saved securely', 'success');
      setTimeout(() => location.reload(), 500); // Reload to trigger API refetch across the app cleanly
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
    const a = document.createElement('a');
    a.href = url;
    a.download = 'movietracky_watchlist.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup exported successfully', 'success');
  };

  const handleImportTrigger = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      const success = importData(ev.target.result);
      if (success) {
        showToast('Data imported successfully', 'success');
      } else {
        showToast('Invalid backup file format', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handleClearData = () => {
    if (confirm('Are you sure? This will delete all your watchlist data permanently.')) {
      clearAll();
      showToast('All data cleared', 'info');
    }
  };

  return (
    <div className="settings-section fade-in">
      <h1 className="page-title" style={{ marginBottom: 'var(--space-xl)' }}>Settings</h1>

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
          onChange={(e) => setApiKey(e.target.value)}
        />
        <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
          <button className="btn btn-primary btn-sm" onClick={handleSaveKey}>Save Key</button>
          {envKey && !apiKey && <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>Using key from .env</span>}
          {apiKey && <button className="btn btn-ghost btn-sm" onClick={handleClearKey}>Clear Option</button>}
        </div>
      </div>

      <div className="settings-group">
        <label>Data Management</label>
        <p>Export your watchlist as JSON, or import a previously exported file. Your data remains strictly on your device.</p>
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
        <label style={{ color: 'var(--accent-danger)' }}>Danger Zone</label>
        <p>Clear all watchlist data and preferences. This action cannot be reversed.</p>
        <button className="btn btn-danger btn-sm" onClick={handleClearData}>Delete All Data</button>
      </div>
    </div>
  );
}
