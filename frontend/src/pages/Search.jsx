import React, { useState, useEffect } from 'react';
import { searchMovies, hasApiKey } from '../api/tmdb.js';
import { MovieGrid, SkeletonCards } from '../components/MovieCard.jsx';

const EMPTY_ICON = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="64" height="64" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path></svg>;
const DANGER_ICON = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="64" height="64" fill="var(--accent-danger)"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>;
const SEARCH_GHOST = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="64" height="64" fill="currentColor"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>;

export default function Search({ query, onMovieClick }) {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setTotalPages(1);
    setError('');

    if (!hasApiKey() || !query) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    searchMovies(query, 1)
      .then(data => {
        if (active) {
          setMovies(data.results || []);
          setTotalPages(data.total_pages || 1);
          setLoading(false);
        }
      })
      .catch(err => {
        if (active) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => active = false;
  }, [query]);

  const loadMore = async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    try {
      const data = await searchMovies(query, page + 1);
      setMovies(prev => [...prev, ...(data.results || [])]);
      setPage(page + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  if (!hasApiKey()) {
    return (
      <div className="empty-state">
        <div className="empty-icon">{EMPTY_ICON}</div>
        <h3>API Key Required</h3>
        <p>Go to Settings to add your TMDB API key.</p>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="fade-in">
        <h1 className="page-title">Search</h1>
        <div className="empty-state">
          <div className="empty-icon">{SEARCH_GHOST}</div>
          <h3>Search for movies</h3>
          <p>Use the search bar above to look for your famous titles.</p>
        </div>
      </div>
    );
  }

  if (error && movies.length === 0) {
    return (
      <div className="empty-state fade-in">
        <div className="empty-icon">{DANGER_ICON}</div>
        <h3>Search failed</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h1 className="page-title">Results for "{query}"</h1>
      
      {loading ? (
        <SkeletonCards count={12} />
      ) : (
        <>
          <MovieGrid movies={movies} onMovieClick={onMovieClick} />
          
          <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
            {page < totalPages ? (
              <button 
                className="btn btn-ghost" 
                onClick={loadMore} 
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading...' : `Load More (${page + 1}/${totalPages})`}
              </button>
            ) : movies.length > 0 ? (
              <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-xs)', fontWeight: 600 }}>End of results</p>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
