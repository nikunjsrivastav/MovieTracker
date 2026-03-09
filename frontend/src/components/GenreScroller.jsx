import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGenres, getFallbackGenreMovie, hasApiKey, IMG_SIZES } from '../api/tmdb.js';

export default function GenreScroller({ movies = [] }) {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [genreBackdrops, setGenreBackdrops] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasApiKey()) {
      setLoading(false);
      return;
    }

    let active = true;
    getGenres()
      .then(data => {
        if (active && data.genres) {
          setGenres(data.genres);
        }
        if (active) setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load genres:", err);
        if (active) setLoading(false);
      });

    return () => active = false;
  }, []);


  useEffect(() => {
    if (genres.length === 0) return;

    let active = true;
    const initialBackdrops = {};
    const usedMovieIds = new Set();
    const missingGenreIds = [];

    // Map the local pool of movies to genres
    genres.forEach(genre => {
      let repMovie = movies.find(m => m.genre_ids && m.genre_ids.includes(genre.id) && !usedMovieIds.has(m.id));
      if (!repMovie) repMovie = movies.find(m => m.genre_ids && m.genre_ids.includes(genre.id));

      if (repMovie) {
        initialBackdrops[genre.id] = repMovie;
        usedMovieIds.add(repMovie.id);
      } else {
        missingGenreIds.push(genre.id);
      }
    });

    setGenreBackdrops(initialBackdrops);

    // Fetch fallback movies for any empty genres
    if (missingGenreIds.length > 0) {
      Promise.all(missingGenreIds.map(async id => {
        try {
          const fallback = await getFallbackGenreMovie(id);
          return { id, movie: fallback };
        } catch (e) {
          return { id, movie: null };
        }
      })).then(results => {
        if (!active) return;
        setGenreBackdrops(prev => {
          const updated = { ...prev };
          results.forEach(({ id, movie }) => {
            if (movie) updated[id] = movie;
          });
          return updated;
        });
      });
    }

    return () => active = false;
  }, [genres, movies]);

  if (loading || genres.length === 0) return null;

  return (
    <div className="genre-scroller-container fade-in" style={{ marginBottom: 'var(--space-2xl)' }}>
      <div className="carousel-header">
        <h2 className="carousel-title">Explore by Genre</h2>
      </div>
      <div 
        className="genre-track" 
        style={{ 
          display: 'flex', 
          gap: 'var(--space-md)', 
          overflowX: 'auto', 
          scrollbarWidth: 'none',
          padding: 'var(--space-xs) 0',
          margin: '0 calc(var(--space-xl) * -1)',
          paddingLeft: 'var(--space-xl)',
          paddingRight: 'var(--space-xl)'
        }}
      >
        {genres.map(genre => {
          const repMovie = genreBackdrops[genre.id];
          const bgImage = repMovie?.backdrop_path ? `${IMG_SIZES.backdrop_sm}${repMovie.backdrop_path}` : null;

          return (
            <div
              key={genre.id}
              className="genre-card"
              style={{
                position: 'relative',
                flexShrink: 0,
                width: '160px',
                height: '90px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
                border: '1px solid var(--glass-border)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.querySelector('.genre-overlay').style.background = 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.querySelector('.genre-overlay').style.background = 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)';
              }}
              onClick={() => navigate(`/genre/${genre.id}/${encodeURIComponent(genre.name)}`)}
            >
              {bgImage ? (
                <img 
                  src={bgImage} 
                  alt={genre.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  loading="lazy"
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--accent-primary) 0%, rgba(0,0,0,0.5) 100%)' }} />
              )}
              
              <div 
                className="genre-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'var(--space-sm)',
                  transition: 'background var(--transition-fast)'
                }}
              >
                <span style={{ 
                  color: '#ffffff', 
                  fontSize: 'var(--font-sm)', 
                  fontWeight: '700', 
                  letterSpacing: '0.02em',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  textAlign: 'center'
                }}>
                  {genre.name}
                </span>
              </div>
            </div>
          );
        })}
        {/* Spacer to allow scrolling past the last item cleanly */}
        <div style={{ paddingRight: 'var(--space-sm)' }}></div>
      </div>
    </div>
  );
}
