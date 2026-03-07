import React from 'react';
import { IMG_SIZES } from '../api/tmdb.js';
import { useWatchlist } from '../store/watchlist.jsx';

const STAR_ICON = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51.11-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Z" fill="currentColor"></path></svg>;
const ADD_ICON = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" fill="currentColor"></path></svg>;

function formatStatus(status) {
  const labels = {
    watching: 'Watching',
    completed: 'Completed',
    plan_to_watch: 'Plan to Watch',
    on_hold: 'On Hold',
    favourites: 'Favourites',
    dropped: 'Dropped',
  };
  return labels[status] || status;
}

export function MovieCard({ movie, onClick }) {
  const { getMovie, addMovie } = useWatchlist();
  const tracked = getMovie(movie.id);

  const year = movie.release_date ? movie.release_date.substring(0, 4) : '';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '—';
  const posterUrl = movie.poster_path ? `${IMG_SIZES.poster_md}${movie.poster_path}` : '';

  const handleAdd = (e) => {
    e.stopPropagation();
    addMovie(movie);
  };

  return (
    <div className="movie-card" onClick={() => onClick(movie)} title={movie.title}>
      {posterUrl ? (
        <img className="poster" src={posterUrl} alt={movie.title} loading="lazy" />
      ) : (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--font-xs)' }}>
          N/A
        </div>
      )}
      
      <div className="card-rating">
        <span style={{ width: '10px', height: '10px', display: 'flex', fill: 'var(--accent-warning)' }}>{STAR_ICON}</span> {rating}
      </div>

      {tracked && (
        <span className={`card-status-badge badge badge-${tracked.status}`}>
          {formatStatus(tracked.status)}
        </span>
      )}

      <div className="card-overlay">
        <div className="card-title">{movie.title}</div>
        <div className="card-year">{year}</div>
        <div className="quick-actions">
          {!tracked ? (
            <button className="btn btn-primary btn-sm quick-add" onClick={handleAdd} title="Add to watchlist">
              {ADD_ICON} Add
            </button>
          ) : (
            <button className="btn btn-ghost btn-sm" title={formatStatus(tracked.status)}>
              {formatStatus(tracked.status)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function MovieGrid({ movies, onMovieClick }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm-48,72H96V88h64Zm0,48H96V136h64Zm-16,48H112V184h32ZM208,208H176V184h16V136H176V88h16V48h16ZM80,184V208H48V48H64V88H48v48H64v48H48v24Z"></path></svg>
        </div>
        <h3>No movies found</h3>
        <p>Try adjusting your search or browse a different category.</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map(m => (
        <MovieCard key={m.id} movie={m} onClick={onMovieClick} />
      ))}
    </div>
  );
}

export function MovieCarousel({ title, movies, onMovieClick }) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="carousel-section">
      <div className="carousel-header">
        <h2 className="carousel-title">{title}</h2>
      </div>
      <div className="carousel-track">
        {movies.map(m => (
          <MovieCard key={m.id} movie={m} onClick={onMovieClick} />
        ))}
        <div className="carousel-more-card" onClick={() => {
          // Dispatch custom event to potentially handle navigation to that category
          const event = new CustomEvent('navigate-more', { detail: { title } });
          document.dispatchEvent(event);
        }}>
          <div className="carousel-more-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24" fill="currentColor"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm45.66-93.66a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32-11.32L148.69,136H88a8,8,0,0,1,0-16h60.69l-18.35-18.34a8,8,0,0,1,11.32-11.32Z"></path></svg>
          </div>
          <span>View More</span>
        </div>
      </div>
    </div>
  );
}

export function SkeletonCards({ count = 6 }) {
  return (
    <div className="movie-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton skeleton-card"></div>
      ))}
    </div>
  );
}

export function SkeletonCarousel() {
  return (
    <div className="carousel-section">
      <div className="carousel-header">
        <div className="skeleton skeleton-text" style={{ width: '140px', height: '24px', borderRadius: 'var(--radius-sm)' }}></div>
      </div>
      <div className="carousel-track">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton skeleton-card" style={{ minWidth: '175px', maxWidth: '175px' }}></div>
        ))}
      </div>
    </div>
  );
}
