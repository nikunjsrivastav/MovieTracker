import React, { useState, useEffect, useRef } from 'react';
import { searchMovies, IMG_SIZES } from '../api/tmdb.js';

const SEARCH_ICON = <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" fill="currentColor"></path></svg>;
const HAMBURGER_ICON = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" fill="currentColor"></path></svg>;

export default function Header({ onMovieClick, onToggleSidebar }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');
  const searchTimeout = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setShowDropdown(false);
      setResults([]);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      try {
        const data = await searchMovies(query.trim());
        setResults(data.results || []);
        setError('');
        setShowDropdown(true);
      } catch (e) {
        setError(e.message);
        setResults([]);
        setShowDropdown(true);
      }
    }, 350);

    return () => clearTimeout(searchTimeout.current);
  }, [query]);

  const toggleMobileMenu = () => {
    if (window.innerWidth > 768) {
      if (onToggleSidebar) onToggleSidebar();
      return;
    }
    document.getElementById('sidebar')?.classList.toggle('open');
    let overlay = document.getElementById('mobile-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'mobile-overlay';
      overlay.id = 'mobile-overlay';
      document.body.appendChild(overlay);
      overlay.addEventListener('click', () => {
        document.getElementById('sidebar')?.classList.remove('open');
        overlay.classList.remove('active');
      });
    }
    overlay.classList.toggle('active');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim().length >= 2) {
      setShowDropdown(false);
      const event = new CustomEvent('navigate-search', { detail: { query: query.trim() } });
      document.dispatchEvent(event);
      setQuery('');
    }
  };

  return (
    <header className="app-header">
      <button className="hamburger-btn btn btn-ghost" style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)' }} onClick={toggleMobileMenu} aria-label="Toggle menu">
        {HAMBURGER_ICON}
      </button>
      <div className="search-container" onBlur={(e) => {
        // Delay closing so clicks on dropdown items still fire
        if (!e.currentTarget.contains(e.relatedTarget)) {
           setTimeout(() => setShowDropdown(false), 200);
        }
      }}>
        <div className="search-input-wrapper">
          {SEARCH_ICON}
          <input
            type="text"
            className="search-input"
            placeholder="Search movies..."
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (query.trim().length >= 2) setShowDropdown(true); }}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        <div className={`search-dropdown ${showDropdown ? 'active' : ''}`}>
          {error ? (
            <div className="search-result-item" style={{ justifyContent: 'center' }}>
              <div className="search-result-info"><h4 style={{ color: 'var(--accent-danger)' }}>{error}</h4></div>
            </div>
          ) : results.length > 0 ? (
            results.slice(0, 8).map(m => (
              <div 
                key={m.id} 
                className="search-result-item" 
                onClick={() => {
                  onMovieClick(m);
                  setShowDropdown(false);
                  setQuery('');
                }}
              >
                <img 
                  src={m.poster_path ? IMG_SIZES.poster_sm + m.poster_path : ''}
                  alt={m.title}
                  onError={(e) => e.target.style.display = 'none'} 
                />
                <div className="search-result-info">
                  <h4>{m.title}</h4>
                  <span>{m.release_date ? m.release_date.substring(0, 4) : '—'} • {m.vote_average ? m.vote_average.toFixed(1) : '—'}</span>
                </div>
              </div>
            ))
          ) : (
             <div className="search-result-item" style={{ justifyContent: 'center' }}>
              <div className="search-result-info"><h4 style={{ color: 'var(--text-secondary)' }}>No results found</h4></div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
