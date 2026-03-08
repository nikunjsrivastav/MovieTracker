import React, { useState, useEffect } from 'react';
import { getMovieDetails, IMG_SIZES } from '../api/tmdb.js';
import { useWatchlist } from '../store/watchlist.jsx';
import { useToast } from './Toast.jsx';

const CLOSE_ICON = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" fill="currentColor"></path></svg>;
const STAR_ICON_OUTLINE = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51.11-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29ZM128,168.08a16,16,0,0,0-8.29,2.3L76,196.88l11.66-50.56a16,16,0,0,0-4.9-15.08L43.83,97.27l51.3-4.45a16,16,0,0,0,12.79-9.3L128,36.56l20.08,47a16,16,0,0,0,12.79,9.3l51.3,4.45-38.93,34a16,16,0,0,0-4.9,15.08l11.66,50.56-43.71-26.5A16,16,0,0,0,128,168.08Z" fill="currentColor"></path></svg>;
const STAR_ICON_FILLED = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z" fill="currentColor"></path></svg>;

const STATUS_ICONS = {
  watching: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><path d="M247.31,124.76c-4.22-5.12-51.57-60.76-119.31-60.76S12.91,119.64,8.69,124.76a8,8,0,0,0,0,6.48c4.22,5.12,51.57,60.76,119.31,60.76s115.09-55.64,119.31-60.76A8,8,0,0,0,247.31,124.76ZM128,176a48,48,0,1,1,48-48A48.06,48.06,0,0,1,128,176Zm0-80a32,32,0,1,0,32,32A32,32,0,0,0,128,96Z" fill="currentColor"></path></svg>,
  completed: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" fill="currentColor"></path></svg>,
  plan_to_watch: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" fill="currentColor"></path></svg>,
  on_hold: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><path d="M112,64V192a8,8,0,0,1-16,0V64a8,8,0,0,1,16,0Zm48-8a8,8,0,0,0-8,8V192a8,8,0,0,0,16,0V64A8,8,0,0,0,160,56Z" fill="currentColor"></path></svg>,
  favourites: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><path d="M240,94c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,220.66,16,164,16,94A62.07,62.07,0,0,1,78,32c22.59,0,41.94,17.31,50,32,8.06-14.69,27.41-32,50-32A62.07,62.07,0,0,1,240,94Z" fill="currentColor"></path></svg>,
  dropped: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="16" height="16"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" fill="currentColor"></path></svg>
};

export default function MovieModal({ movieId, onClose }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const { getMovie, addMovie, updateStatus, updateRating, removeMovie, isTracked } = useWatchlist();
  const { showToast } = useToast();

  useEffect(() => {
    // Prevent background scrolling while modal is open
    document.body.style.overflow = 'hidden';

    let active = true;
    (async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(movieId);
        if (active) {
          setMovie(data);
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          showToast(err.message, 'error');
          onClose(); // Auto close on fetch error
        }
      }
    })();

    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleEsc);

    return () => {
      active = false;
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = ''; // Restore background scrolling
    };
  }, [movieId, onClose, showToast]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200); // Matches CSS animation timing
  };

  if (loading || !movie) {
    return (
      <div className="modal-overlay">
        <div className="modal-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
          <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', animation: 'shimmer 1s infinite alternate' }}></div>
        </div>
      </div>
    );
  }

  const tracked = getMovie(movie.id);
  const backdropUrl = movie.backdrop_path ? `${IMG_SIZES.backdrop_lg}${movie.backdrop_path}` : '';
  const year = movie.release_date ? movie.release_date.substring(0, 4) : '—';
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : '';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '—';
  const cast = movie.credits?.cast?.slice(0, 10) || [];
  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  const handleStatusChange = (e) => {
    const val = e.target.value;
    if (!val) return;
    
    if (isTracked(movie.id)) {
      updateStatus(movie.id, val);
      showToast(`Status updated to ${val.replace(/_/g, ' ')}`, 'success');
    } else {
      addMovie(movie, val);
      showToast(`Added "${movie.title}" to ${val.replace(/_/g, ' ')}`, 'success');
    }
  };

  const handleRating = (r) => {
    if (!isTracked(movie.id)) {
      addMovie(movie, 'completed', r);
    } else {
      updateRating(movie.id, r);
    }
    showToast(`Rated "${movie.title}" ${r}/10`, 'success');
  };

  const currentRating = tracked?.rating || 0;

  return (
    <div className={`modal-overlay ${isClosing ? 'fade-out' : ''}`} onClick={(e) => { if (e.target.id === 'modal-overlay') handleClose(); }} id="modal-overlay">
      <div className="modal-container" style={isClosing ? { animation: 'modalScaleDown 0.2s ease forwards' } : {}}>
        <button className="modal-close" onClick={handleClose}>{CLOSE_ICON}</button>
        {backdropUrl ? (
          <img className="modal-backdrop-img" src={backdropUrl} alt={movie.title} />
        ) : (
          <div style={{ height: '80px' }}></div>
        )}
        
        <div className="modal-body">
          <h2 className="modal-title">{movie.title}</h2>
          <div className="modal-meta">
            <span>{year}</span>
            {runtime && <><span>•</span><span>{runtime}</span></>}
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="14" height="14" fill="var(--accent-warning)"><path d="M239.2,97.29a16,16,0,0,0-13.81-11L166,81.17,142.72,25.81h0a15.95,15.95,0,0,0-29.44,0L90.07,81.17,30.61,86.32a16,16,0,0,0-9.11,28.06L66.61,153.8,53.09,212.34a16,16,0,0,0,23.84,17.34l51.11-31,51.11,31a16,16,0,0,0,23.84-17.34l-13.51-58.6,45.1-39.36A16,16,0,0,0,239.2,97.29Z"></path></svg>
              {rating}/10
            </span>
            {movie.vote_count && <span style={{ opacity: 0.6 }}>({movie.vote_count.toLocaleString()})</span>}
          </div>
          
          <div className="modal-genres">
            {(movie.genres || []).map(g => (
              <span key={g.id} className="genre-tag">{g.name}</span>
            ))}
          </div>
          
          <p className="modal-overview">{movie.overview || 'No overview available.'}</p>

          <div className="modal-actions" style={{ overflow: 'visible', zIndex: 10 }}>
            <div className="custom-dropdown">
              <button 
                className={`custom-dropdown-btn ${isDropdownOpen ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {tracked?.status && STATUS_ICONS[tracked.status]}
                  {tracked?.status ? tracked.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Add to List...'}
                </span>
                <svg className="custom-dropdown-icon" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
              </button>
              
              <div className={`custom-dropdown-menu ${isDropdownOpen ? 'visible' : ''}`}>
                {[
                  { value: 'watching', label: 'Watching' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'plan_to_watch', label: 'Plan to Watch' },
                  { value: 'on_hold', label: 'On Hold' },
                  { value: 'favourites', label: 'Favourites' },
                  { value: 'dropped', label: 'Dropped' }
                ].map(opt => (
                  <div 
                    key={opt.value}
                    className={`custom-dropdown-item ${tracked?.status === opt.value ? 'selected' : ''}`}
                    onClick={() => {
                      handleStatusChange({ target: { value: opt.value } });
                      setIsDropdownOpen(false);
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {STATUS_ICONS[opt.value]} {opt.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {tracked && (
              <button className="btn btn-danger btn-sm" onClick={() => { removeMovie(movie.id); showToast(`Removed "${movie.title}"`, 'info'); }}>
                Remove
              </button>
            )}
            
            <div className="personal-rating" style={{ display: 'flex', gap: '2px', alignItems: 'center', marginLeft: 'auto' }}>
              {Array.from({ length: 10 }).map((_, i) => {
                const val = i + 1;
                const isActive = val <= currentRating;
                return (
                  <span 
                    key={val}
                    className={`rating-star ${isActive ? 'active' : ''}`} 
                    title={`${val}/10`}
                    onClick={() => handleRating(val)}
                  >
                    {isActive ? STAR_ICON_FILLED : STAR_ICON_OUTLINE}
                  </span>
                );
              })}
            </div>
          </div>

          {trailer && (
            <div style={{ marginBottom: 'var(--space-2xl)' }}>
              <h3 className="modal-section-title">Trailer</h3>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'var(--shadow-md)' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {cast.length > 0 && (
            <>
              <h3 className="modal-section-title">Cast</h3>
              <div className="cast-grid">
                {cast.map(c => (
                  <div key={c.id} className="cast-card">
                    <img 
                      src={c.profile_path ? IMG_SIZES.profile_sm + c.profile_path : ''}
                      alt={c.name}
                      onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%232C2C2E%22 width=%22100%22 height=%22100%22/><circle cx=%2250%22 cy=%2240%22 r=%2215%22 fill=%22%23555%22/><path d=%22M20 90 Q50 60 80 90%22 stroke=%22%23555%22 stroke-width=%2210%22 fill=%22none%22/></svg>'; }} 
                    />
                    <div className="cast-name">{c.name}</div>
                    <div className="cast-role">{c.character || ''}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
