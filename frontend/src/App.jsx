import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import MovieModal from './components/MovieModal.jsx';

// Pages
import Home from './pages/Home.jsx';
import MyList from './pages/MyList.jsx';
import Search from './pages/Search.jsx';
import Browse from './pages/Browse.jsx';
import Genres from './pages/Genres.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('app_accent') || '#0A84FF');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-primary', accentColor);
    document.documentElement.style.setProperty('--accent-primary-hover', accentColor);

    // Calculate perceived brightness to determine text color
    const hex = accentColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    document.documentElement.style.setProperty('--accent-text', luminance > 0.6 ? '#000000' : '#ffffff');

    localStorage.setItem('app_accent', accentColor);
  }, [accentColor]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    // Check if bg.jpg exists (using a simple image load)
    const img = new Image();
    img.src = '/src/assets/bg.jpg';
    img.onload = () => document.body.classList.add('has-custom-bg');
    img.onerror = () => document.body.classList.remove('has-custom-bg');
  }, []);

  useEffect(() => {
    const handleSearchNav = (e) => navigate(`/search?q=${encodeURIComponent(e.detail.query)}`);
    const handleMoreNav = (e) => {
      const title = e.detail.title;
      if (title === 'Trending This Week') navigate('/browse/trending');
      else if (title === 'Popular') navigate('/browse/popular');
      else if (title === 'Top Rated' || title === 'Top Rated On IMDb') navigate('/browse/top_rated');
      else if (title === 'Now Playing') navigate('/browse/now_playing');
    };

    document.addEventListener('navigate-search', handleSearchNav);
    document.addEventListener('navigate-more', handleMoreNav);

    return () => {
      document.removeEventListener('navigate-search', handleSearchNav);
      document.removeEventListener('navigate-more', handleMoreNav);
    };
  }, [navigate]);

  return (
    <div id="app" className={isSidebarCollapsed ? 'sidebar-collapsed' : ''}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className="app-main">
        <Header
          onMovieClick={(m) => setSelectedMovieId(m.id)}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home onMovieClick={(m) => setSelectedMovieId(m.id)} />} />
            <Route path="/mylist/:filter?" element={<MyList onMovieClick={(m) => setSelectedMovieId(m.id)} />} />
            <Route path="/search" element={<Search onMovieClick={(m) => setSelectedMovieId(m.id)} />} />
            <Route path="/browse/:category" element={<Browse onMovieClick={(m) => setSelectedMovieId(m.id)} />} />
            <Route path="/genre/:id/:name" element={<Browse category="genre" onMovieClick={(m) => setSelectedMovieId(m.id)} />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/settings" element={<Settings theme={theme} setTheme={setTheme} accentColor={accentColor} setAccentColor={setAccentColor} />} />
            <Route path="*" element={<Home onMovieClick={(m) => setSelectedMovieId(m.id)} />} />
          </Routes>
        </div>
      </main>

      {selectedMovieId && (
        <MovieModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
        />
      )}
    </div>
  );
}
