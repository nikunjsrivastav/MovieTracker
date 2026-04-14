import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { IMG_SIZES, searchMovies } from '../api/tmdb.js';
import { useAuth } from '../store/auth.jsx';

const SEARCH_ICON = <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" fill="currentColor"></path></svg>;
const HAMBURGER_ICON = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" fill="currentColor"></path></svg>;

const PROFILE_ACTIONS = [
  { label: 'View profile', to: '/account/profile' },
  { label: 'Edit profile', to: '/account/edit' },
  { label: 'Change password', to: '/account/password' },
  { label: 'Settings', to: '/settings' },
];

export default function Header({ onMovieClick, onToggleSidebar }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, openAuthModal, logout, status } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [error, setError] = useState('');
  const searchTimeout = useRef(null);
  const profileMenuRef = useRef(null);

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
      } catch (requestError) {
        setError(requestError.message);
        setResults([]);
        setShowDropdown(true);
      }
    }, 350);

    return () => clearTimeout(searchTimeout.current);
  }, [query]);

  useEffect(() => {
    if (!showProfileMenu) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [showProfileMenu]);

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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && query.trim().length >= 2) {
      setShowDropdown(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  const avatarLabel = (user?.name || user?.email || '?').charAt(0).toUpperCase();

  return (
    <header className="app-header">
      <button
        className="hamburger-btn btn btn-ghost"
        style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)' }}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {HAMBURGER_ICON}
      </button>

      <div
        className="search-container"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setTimeout(() => setShowDropdown(false), 200);
          }
        }}
      >
        <div className="search-input-wrapper">
          {SEARCH_ICON}
          <input
            type="text"
            className="search-input"
            placeholder="Search movies..."
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
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
            results.slice(0, 8).map((movie) => (
              <div
                key={movie.id}
                className="search-result-item"
                onClick={() => {
                  onMovieClick(movie);
                  setShowDropdown(false);
                  setQuery('');
                }}
              >
                <img
                  src={movie.poster_path ? IMG_SIZES.poster_sm + movie.poster_path : ''}
                  alt={movie.title}
                  onError={(event) => { event.target.style.display = 'none'; }}
                />
                <div className="search-result-info">
                  <h4>{movie.title}</h4>
                  <span>
                    {movie.release_date ? movie.release_date.substring(0, 4) : '--'}
                    {' | '}
                    {movie.vote_average ? movie.vote_average.toFixed(1) : '--'}
                  </span>
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

      <div className="header-auth-area" ref={profileMenuRef}>
        {!isAuthenticated ? (
          <button
            type="button"
            className="btn btn-primary header-login-btn"
            onClick={() => openAuthModal('login')}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Checking...' : 'Login'}
          </button>
        ) : (
          <div className="profile-menu-shell">
            <button
              type="button"
              className="profile-trigger"
              onClick={() => setShowProfileMenu((current) => !current)}
              aria-haspopup="menu"
              aria-expanded={showProfileMenu}
            >
              <span className="profile-avatar">{avatarLabel}</span>
            </button>

            <div className={`profile-dropdown ${showProfileMenu ? 'active' : ''}`}>
              <div className="profile-dropdown-summary">
                <strong>{user?.name || 'MovieTracker member'}</strong>
                <span>{user?.email}</span>
              </div>

              {PROFILE_ACTIONS.map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="profile-dropdown-item"
                  onClick={() => setShowProfileMenu(false)}
                >
                  {action.label}
                </Link>
              ))}

              <button
                type="button"
                className="profile-dropdown-item danger"
                onClick={() => {
                  setShowProfileMenu(false);
                  logout({ redirectTo: '/' });
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
