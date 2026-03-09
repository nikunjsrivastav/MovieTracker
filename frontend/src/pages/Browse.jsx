import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getPopular, getTopRated, getNowPlaying, getTrending, getMoviesByGenre, hasApiKey } from '../api/tmdb.js';
import { MovieGrid, SkeletonCards } from '../components/MovieCard.jsx';

const PAGE_CONFIG = {
  trending: { title: 'Trending This Week', fetcher: (page) => getTrending('week', page) },
  popular: { title: 'Popular Movies', fetcher: getPopular },
  top_rated: { title: 'Top Rated Movies', fetcher: getTopRated },
  now_playing: { title: 'Now Playing', fetcher: getNowPlaying },
};

const EMPTY_ICON = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="64" height="64" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path></svg>;
const DANGER_ICON = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="64" height="64" fill="var(--accent-danger)"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>;

export default function Browse({ onMovieClick, category: propCategory }) {
  const { category: urlCategory, id, name } = useParams();
  
  // Support both url params and explicitly passed props (for genres which pass 'genre')
  const category = propCategory || urlCategory;
  const genreId = id;
  const genreName = name ? decodeURIComponent(name) : '';

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  
  const observerTarget = useRef(null);

  const title = category === 'genre' ? `${genreName} Movies` : PAGE_CONFIG[category]?.title;

  const fetcher = useCallback((p) => {
    if (category === 'genre') {
      return getMoviesByGenre(genreId, p);
    }
    return PAGE_CONFIG[category]?.fetcher(p);
  }, [category, genreId]);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setTotalPages(1);
    setError('');
    
    if (!hasApiKey() || (category !== 'genre' && !PAGE_CONFIG[category])) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    fetcher(1)
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
  }, [category, genreId, fetcher]);

  const loadMore = useCallback(async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    try {
      const data = await fetcher(page + 1);
      setMovies(prev => [...prev, ...(data.results || [])]);
      setPage(page + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, page, totalPages, fetcher]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && !loadingMore && page < totalPages) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '400px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, loadMore, loading, loadingMore, page, totalPages]);

  if (category !== 'genre' && !PAGE_CONFIG[category]) return <div className="empty-state"><h3>Page not found</h3></div>;

  if (!hasApiKey()) {
    return (
      <div className="empty-state">
        <div className="empty-icon">{EMPTY_ICON}</div>
        <h3>API Key Required</h3>
        <p>Go to Settings to add your TMDB API key.</p>
      </div>
    );
  }

  if (error && movies.length === 0) {
    return (
      <div className="empty-state fade-in">
        <div className="empty-icon">{DANGER_ICON}</div>
        <h3>Failed to load</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h1 className="page-title" style={{ marginBottom: 'var(--space-xl)' }}>{title}</h1>
      
      {loading ? (
        <SkeletonCards count={18} />
      ) : (
        <>
          <MovieGrid movies={movies} onMovieClick={onMovieClick} />
          
          <div ref={observerTarget} style={{ textAlign: 'center', padding: 'var(--space-xl)', height: '40px' }}>
            {loadingMore && (
              <div className="btn btn-ghost disabled" style={{ pointerEvents: 'none' }}>
                <svg className="spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" fill="currentColor"><path d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z"></path></svg>
                <span style={{ marginLeft: '8px' }}>Loading...</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
