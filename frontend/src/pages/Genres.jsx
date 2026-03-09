import React, { useState, useEffect } from 'react';
import { getGenres, getPopular, getTrending, hasApiKey, IMG_SIZES } from '../api/tmdb.js';

const EMPTY_ICON = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="64" height="64" fill="currentColor"><path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path></svg>;

export default function Genres({ onNavigate }) {
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hasApiKey()) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    // Fetch genres and a large pool of movies to use as background images
    Promise.all([
      getGenres(),
      getPopular(1),
      getPopular(2),
      getTrending('week'),
      getTrending('day')
    ])
    .then(([genData, pop1, pop2, trendW, trendD]) => {
      if (active) {
        setGenres(genData.genres || []);
        
        // Combine movie results to create a rich pool of backdrops
        let allMovies = [];
        if (pop1 && pop1.results) allMovies = [...allMovies, ...pop1.results];
        if (pop2 && pop2.results) allMovies = [...allMovies, ...pop2.results];
        if (trendW && trendW.results) allMovies = [...allMovies, ...trendW.results];
        if (trendD && trendD.results) allMovies = [...allMovies, ...trendD.results];
        
        // Deduplicate movies by ID robustly
        const uniqueMovies = allMovies.filter((movie, index, self) => 
          movie && movie.id && index === self.findIndex((m) => m && m.id === movie.id)
        );
        
        console.log(`Fetched ${uniqueMovies.length} unique movies for backdrops`);
        setMovies(uniqueMovies);
        
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
  }, []);

  if (!hasApiKey()) {
    return (
      <div className="empty-state fade-in">
        <div className="empty-icon">{EMPTY_ICON}</div>
        <h3>API Key Required</h3>
        <p>Go to Settings to add your TMDB API key.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state fade-in">
        <div className="empty-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="64" height="64" fill="var(--accent-danger)"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,130.34a8,8,0,0,1-11.32,11.32L128,139.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L116.69,128,90.34,101.66a8,8,0,0,1,11.32-11.32L128,116.69l26.34-26.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg></div>
        <h3>Failed to load</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fade-in">
        <h1 className="page-title" style={{ marginBottom: 'var(--space-xl)' }}>All Genres</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-lg)' }}>
          {Array(19).fill(0).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '160px', borderRadius: 'var(--radius-xl)' }}></div>
          ))}
        </div>
      </div>
    );
  }

  // Pre-calculate unique backdrops for each genre
  const genreBackdrops = {};
  const usedMovieIds = new Set();

  console.log(`Mapping genres with pool of ${movies.length} movies...`);

  if (movies.length > 0) {
    genres.forEach(genre => {
      // Try to find a movie that hasn't been used yet for a backdrop
      let repMovie = movies.find(m => m.genre_ids && m.genre_ids.includes(genre.id) && !usedMovieIds.has(m.id));
      
      // If all movies for this genre are already used, fallback to any movie with this genre
      if (!repMovie) {
        repMovie = movies.find(m => m.genre_ids && m.genre_ids.includes(genre.id));
      }

      if (repMovie) {
        genreBackdrops[genre.id] = repMovie;
        usedMovieIds.add(repMovie.id);
      }
    });
  }

  return (
    <div className="fade-in">
      <h1 className="page-title" style={{ marginBottom: 'var(--space-xl)' }}>All Genres</h1>
      
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
          gap: 'var(--space-lg)',
          paddingBottom: 'var(--space-2xl)'
        }}
      >
        {genres.map(genre => {
          const repMovie = genreBackdrops[genre.id];
          const bgImage = repMovie?.backdrop_path ? `${IMG_SIZES.backdrop_md}${repMovie.backdrop_path}` : null;

          return (
            <div
              key={genre.id}
              className="genre-card glass-panel"
              style={{
                position: 'relative',
                height: '140px',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1), box-shadow 0.3s ease',
                padding: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.querySelector('.genre-overlay').style.background = 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.1) 100%)';
                const img = e.currentTarget.querySelector('.genre-bg-img');
                if (img) img.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.querySelector('.genre-overlay').style.background = 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 100%)';
                const img = e.currentTarget.querySelector('.genre-bg-img');
                if (img) img.style.transform = 'scale(1)';
              }}
              onClick={() => onNavigate('genre', { genreId: genre.id, genreName: genre.name })}
            >
              {bgImage ? (
                <img 
                  className="genre-bg-img"
                  src={bgImage} 
                  alt={genre.name} 
                  style={{ 
                    position: 'absolute',
                    inset: 0,
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }} 
                  loading="lazy"
                />
              ) : (
                <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--accent-primary) 0%, rgba(0,0,0,0.5) 100%)' }} />
              )}
              
              <div 
                className="genre-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 100%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  padding: 'var(--space-lg)',
                  transition: 'background 0.3s ease'
                }}
              >
                <span style={{ 
                  color: '#ffffff', 
                  fontSize: 'var(--font-xl)', 
                  fontWeight: '800', 
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                }}>
                  {genre.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
