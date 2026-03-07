import React from 'react';
import { useWatchlist } from '../store/watchlist.jsx';
import { MovieGrid } from '../components/MovieCard.jsx';

const STATUS_LABELS = {
  all: 'All',
  watching: 'Watching',
  completed: 'Completed',
  plan_to_watch: 'Plan to Watch',
  on_hold: 'On Hold',
  favourites: 'Favourites',
  dropped: 'Dropped',
};

const EMPTY_ICON = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" width="64" height="64"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a16,16,0,0,1-16,16H96a16,16,0,0,1,0-32h64A16,16,0,0,1,176,88Zm0,48a16,16,0,0,1-16,16H96a16,16,0,0,1,0-32h64A16,16,0,0,1,176,136Zm-32,48a16,16,0,0,1-16,16H96a16,16,0,0,1,0-32h32A16,16,0,0,1,144,184Z"></path></svg>;

export default function MyList({ filter = 'all', onMovieClick, onNavigate }) {
  const { getStats, getByStatus, getAll } = useWatchlist();
  
  const stats = getStats();
  const movies = filter === 'all' ? getAll() : getByStatus(filter);

  // Sort by recently updated
  movies.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">My List</h1>
      </div>

      <div className="stats-row slide-up">
        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--text-primary)' }}>{stats.total}</div>
          <div className="stat-label">Total Movies</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#0A84FF' }}>{stats.watching}</div>
          <div className="stat-label">Watching</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#30D158' }}>{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#FF9F0A' }}>{stats.plan_to_watch}</div>
          <div className="stat-label">Plan to Watch</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#FFD60A' }}>{stats.on_hold}</div>
          <div className="stat-label">On Hold</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#BF5AF2' }}>{stats.favourites}</div>
          <div className="stat-label">Favourites</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#FF453A' }}>{stats.dropped}</div>
          <div className="stat-label">Dropped</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}>
            {stats.avgRating}
            <svg style={{ width: '16px', height: '16px', marginLeft: '2px', fill: 'var(--accent-warning)' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51.11-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Z"></path></svg>
          </div>
          <div className="stat-label">Avg Rating</div>
        </div>
      </div>

      <div className="tabs slide-up" style={{ animationDelay: '50ms' }}>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <div 
            key={key} 
            className={`tab-item ${filter === key ? 'active' : ''}`}
            onClick={() => onNavigate('mylist', { filter: key })}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="slide-up" style={{ animationDelay: '100ms' }}>
        {movies.length > 0 ? (
          <MovieGrid movies={movies} onMovieClick={onMovieClick} />
        ) : (
          <div className="empty-state">
            <div className="empty-icon">{EMPTY_ICON}</div>
            <h3>{filter === 'all' ? 'Your list is empty' : `No ${STATUS_LABELS[filter]} movies`}</h3>
            <p>Search for movies and add them to your list to start tracking.</p>
          </div>
        )}
      </div>
    </div>
  );
}
