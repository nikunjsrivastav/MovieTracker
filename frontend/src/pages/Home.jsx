import React, { useState, useEffect } from 'react';
import { getTrending, getPopular, getTopRated, getNowPlaying, IMG_SIZES, hasApiKey } from '../api/tmdb.js';
import { MovieCarousel, SkeletonCarousel } from '../components/MovieCard.jsx';

const EMPTY_ICON = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="64" height="64" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path></svg>;

export default function Home({ onMovieClick }) {
  const [data, setData] = useState({ trending: [], popular: [], topRated: [], nowPlaying: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (data.trending.length === 0) return;
    const maxSlides = Math.min(data.trending.length, 5);
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % maxSlides);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, [data.trending]);

  const nextSlide = () => {
    const maxSlides = Math.min(data.trending.length, 5);
    setCurrentSlide((prev) => (prev + 1) % maxSlides);
  };

  const prevSlide = () => {
    const maxSlides = Math.min(data.trending.length, 5);
    setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
  };

  useEffect(() => {
    if (!hasApiKey()) {
      setLoading(false);
      return;
    }

    let active = true;
    Promise.all([
      getTrending('week'),
      getPopular(),
      getTopRated(),
      getNowPlaying(),
    ]).then(([trend, pop, top, now]) => {
      if (active) {
        setData({
          trending: trend.results || [],
          popular: pop.results || [],
          topRated: top.results || [],
          nowPlaying: now.results || []
        });
        setLoading(false);
      }
    }).catch(err => {
      if (active) {
        setError(err.message);
        setLoading(false);
      }
    });

    return () => active = false;
  }, []);

  if (!hasApiKey()) {
    return (
      <div className="empty-state fade-in">
        <div className="empty-icon">{EMPTY_ICON}</div>
        <h3>API Key Required</h3>
        <p>Go to Settings in the sidebar to add your TMDB API key and start discovering movies.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fade-in">
        <div className="skeleton" style={{ height: '480px', borderRadius: 'var(--radius-2xl)', marginBottom: 'var(--space-2xl)' }}></div>
        <SkeletonCarousel />
        <SkeletonCarousel />
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <div className="empty-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="64" height="64" fill="var(--accent-danger)"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg></div>
        <h3>Failed to load</h3>
        <p>{error}</p>
      </div>
    );
  }

  const heroMovies = data.trending.slice(0, 5);

  return (
    <div className="fade-in">
      {heroMovies.length > 0 && (
        <div className="hero-slider-container">
          {heroMovies.map((movie, index) => (
            <div 
              key={movie.id} 
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              onClick={() => onMovieClick(movie)}
              style={{ cursor: 'pointer' }}
            >
              {movie.backdrop_path && (
                <img className="hero-backdrop" src={`${IMG_SIZES.backdrop_original}${movie.backdrop_path}`} alt={movie.title} loading={index === 0 ? "eager" : "lazy"} />
              )}
              <div className="hero-gradient"></div>
              <div className="hero-content">
                <div className="hero-label">Trending Now</div>
                <h1 className="hero-title">{movie.title}</h1>
                <div className="hero-meta" style={{ color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 'var(--space-sm)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="14" height="14" fill="var(--accent-warning)"><path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51.11-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Z"></path></svg>
                    {movie.vote_average?.toFixed(1) || '—'}
                  </span>
                  <span>•</span>
                  <span>{movie.release_date?.substring(0, 4) || '—'}</span>
                </div>
                <p className="hero-overview">{movie.overview}</p>
                <div className="hero-actions">
                  <button className="btn btn-primary" style={{ padding: '0.8rem 1.75rem', fontSize: 'var(--font-md)' }} onClick={(e) => { e.stopPropagation(); onMovieClick(movie); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" fill="currentColor"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM168,128a40,40,0,1,1-40-40A40,40,0,0,1,168,128Z"></path></svg>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button className="hero-nav-btn hero-nav-prev" onClick={(e) => { e.stopPropagation(); prevSlide(); }} aria-label="Previous Slide">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24" fill="currentColor"><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path></svg>
          </button>
          <button className="hero-nav-btn hero-nav-next" onClick={(e) => { e.stopPropagation(); nextSlide(); }} aria-label="Next Slide">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24" fill="currentColor"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path></svg>
          </button>

          <div className="hero-indicators">
            {heroMovies.map((_, index) => (
              <div 
                key={index} 
                className={`hero-indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setCurrentSlide(index); }}
              />
            ))}
          </div>
        </div>
      )}

      <MovieCarousel title="Trending This Week" movies={data.trending.slice(5)} onMovieClick={onMovieClick} />
      <MovieCarousel title="Popular" movies={data.popular} onMovieClick={onMovieClick} />
      <MovieCarousel title="Top Rated" movies={data.topRated} onMovieClick={onMovieClick} />
      <MovieCarousel title="Now Playing" movies={data.nowPlaying} onMovieClick={onMovieClick} />
    </div>
  );
}
