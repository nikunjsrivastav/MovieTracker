import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import MovieModal from './components/MovieModal.jsx';
import AuthModal from './components/AuthModal.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import Home from './pages/Home.jsx';
import MyList from './pages/MyList.jsx';
import Search from './pages/Search.jsx';
import Browse from './pages/Browse.jsx';
import Genres from './pages/Genres.jsx';
import Settings from './pages/Settings.jsx';
import EditProfile from './pages/account/EditProfile.jsx';
import ChangePassword from './pages/account/ChangePassword.jsx';
import DeleteAccount from './pages/account/DeleteAccount.jsx';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const createRandomSeed = () => Math.floor(Math.random() * 2147483646) + 1;

function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  const fullHex = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(fullHex)) {
    return { r: 10, g: 132, b: 255 };
  }

  return {
    r: parseInt(fullHex.slice(0, 2), 16),
    g: parseInt(fullHex.slice(2, 4), 16),
    b: parseInt(fullHex.slice(4, 6), 16),
  };
}

function rgbToHsl({ r, g, b }) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) {
    return { h: 0, s: 0, l: lightness };
  }

  const saturation = lightness > 0.5
    ? delta / (2 - max - min)
    : delta / (max + min);

  let hue;
  switch (max) {
    case red:
      hue = (green - blue) / delta + (green < blue ? 6 : 0);
      break;
    case green:
      hue = (blue - red) / delta + 2;
      break;
    default:
      hue = (red - green) / delta + 4;
      break;
  }

  return { h: hue * 60, s: saturation, l: lightness };
}

function hslToRgb(h, s, l) {
  const hue = ((h % 360) + 360) % 360;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const segment = hue / 60;
  const x = chroma * (1 - Math.abs((segment % 2) - 1));
  const match = l - chroma / 2;
  let red = 0;
  let green = 0;
  let blue = 0;

  if (segment >= 0 && segment < 1) {
    red = chroma;
    green = x;
  } else if (segment < 2) {
    red = x;
    green = chroma;
  } else if (segment < 3) {
    green = chroma;
    blue = x;
  } else if (segment < 4) {
    green = x;
    blue = chroma;
  } else if (segment < 5) {
    red = x;
    blue = chroma;
  } else {
    red = chroma;
    blue = x;
  }

  return {
    r: Math.round((red + match) * 255),
    g: Math.round((green + match) * 255),
    b: Math.round((blue + match) * 255),
  };
}

function toCssColor(h, s, l, alpha = 1) {
  const { r, g, b } = hslToRgb(h, s, l);
  return alpha < 1 ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`;
}

function createSeededRandom(seed) {
  let value = Math.abs(Math.floor(seed)) % 2147483647;
  if (value === 0) {
    value = 1;
  }

  return () => {
    value = (value * 48271) % 2147483647;
    return value / 2147483647;
  };
}

function randomBetween(random, min, max) {
  return min + (max - min) * random();
}

function buildAccentTheme(accentHex, backgroundSeed) {
  const rgb = hexToRgb(accentHex);
  const baseHsl = rgbToHsl(rgb);
  const hue = baseHsl.s < 0.08 ? 210 : baseHsl.h;
  const saturation = baseHsl.s < 0.08 ? 0.6 : clamp(baseHsl.s, 0.45, 0.95);
  const hoverLightness = clamp(baseHsl.l + (baseHsl.l > 0.7 ? -0.08 : 0.08), 0.32, 0.74);
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  const random = createSeededRandom(backgroundSeed);

  const gradientAngle = `${Math.round(randomBetween(random, 132, 178))}deg`;
  const primaryLayer = `radial-gradient(${Math.round(randomBetween(random, 58, 82))}rem ${Math.round(randomBetween(random, 58, 82))}rem at ${Math.round(randomBetween(random, 8, 26))}% ${Math.round(randomBetween(random, 10, 28))}%, ${toCssColor(hue, clamp(saturation * 0.85, 0.32, 0.95), 0.54, 0.26)} 0%, transparent ${Math.round(randomBetween(random, 54, 64))}%)`;
  const secondaryLayer = `radial-gradient(${Math.round(randomBetween(random, 46, 66))}rem ${Math.round(randomBetween(random, 46, 66))}rem at ${Math.round(randomBetween(random, 72, 92))}% ${Math.round(randomBetween(random, 10, 28))}%, ${toCssColor(hue + 34, clamp(saturation * 0.72, 0.22, 0.88), 0.48, 0.2)} 0%, transparent ${Math.round(randomBetween(random, 48, 58))}%)`;
  const tertiaryLayer = `radial-gradient(${Math.round(randomBetween(random, 52, 74))}rem ${Math.round(randomBetween(random, 52, 74))}rem at ${Math.round(randomBetween(random, 38, 64))}% ${Math.round(randomBetween(random, 70, 90))}%, ${toCssColor(hue - 42, clamp(saturation * 0.68, 0.2, 0.84), 0.44, 0.18)} 0%, transparent ${Math.round(randomBetween(random, 52, 60))}%)`;
  const overlayPrimary = `radial-gradient(${Math.round(randomBetween(random, 28, 46))}rem ${Math.round(randomBetween(random, 28, 46))}rem at ${Math.round(randomBetween(random, 14, 84))}% ${Math.round(randomBetween(random, 16, 74))}%, ${toCssColor(hue + 8, clamp(saturation * 0.42, 0.14, 0.55), 0.82, 0.08)} 0%, transparent ${Math.round(randomBetween(random, 56, 66))}%)`;
  const overlaySecondary = `radial-gradient(${Math.round(randomBetween(random, 30, 48))}rem ${Math.round(randomBetween(random, 30, 48))}rem at ${Math.round(randomBetween(random, 20, 86))}% ${Math.round(randomBetween(random, 18, 76))}%, ${toCssColor(hue, clamp(saturation * 0.56, 0.18, 0.72), 0.58, 0.16)} 0%, transparent ${Math.round(randomBetween(random, 52, 62))}%)`;
  const overlayHighlight = `radial-gradient(${Math.round(randomBetween(random, 24, 40))}rem ${Math.round(randomBetween(random, 24, 40))}rem at ${Math.round(randomBetween(random, 18, 82))}% ${Math.round(randomBetween(random, 12, 68))}%, ${toCssColor(hue - 18, clamp(saturation * 0.48, 0.16, 0.64), 0.72, 0.1)} 0%, transparent ${Math.round(randomBetween(random, 54, 66))}%)`;

  return {
    accentHover: toCssColor(hue, clamp(saturation * 0.92, 0.38, 1), hoverLightness),
    accentText: luminance > 0.6 ? '#000000' : '#ffffff',
    bgBase: toCssColor(hue - 18, clamp(saturation * 0.3, 0.14, 0.36), 0.06),
    bgTop: toCssColor(hue, clamp(saturation * 0.38, 0.16, 0.5), 0.11),
    bgBottom: toCssColor(hue + 24, clamp(saturation * 0.28, 0.12, 0.38), 0.045),
    bgVignette: 'rgba(0, 0, 0, 0.38)',
    bgGradientAngle: gradientAngle,
    bgAmbientPrimaryLayer: primaryLayer,
    bgAmbientSecondaryLayer: secondaryLayer,
    bgAmbientTertiaryLayer: tertiaryLayer,
    bgAmbientOverlayPrimary: overlayPrimary,
    bgAmbientOverlaySecondary: overlaySecondary,
    bgAmbientOverlayHighlight: overlayHighlight,
  };
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('app_accent') || '#0A84FF');
  const [backgroundSeed, setBackgroundSeed] = useState(() => {
    const storedSeed = parseInt(localStorage.getItem('app_bg_seed') || '', 10);
    return Number.isFinite(storedSeed) && storedSeed > 0 ? storedSeed : createRandomSeed();
  });
  const [borderRadius, setBorderRadius] = useState(() => {
    const stored = localStorage.getItem('app_radius');
    if (!stored) return 1;
    if (stored === 'sharp') return 0;
    if (stored === 'sm') return 0.5;
    if (stored === 'default') return 1;
    if (stored === 'lg') return 1.5;
    if (stored === 'xl') return 2;
    const parsed = parseFloat(stored);
    return isNaN(parsed) ? 1 : parsed;
  });



  useEffect(() => {
    const theme = buildAccentTheme(accentColor, backgroundSeed);

    document.documentElement.style.setProperty('--accent-primary', accentColor);
    document.documentElement.style.setProperty('--accent-primary-hover', theme.accentHover);
    document.documentElement.style.setProperty('--accent-text', theme.accentText);
    document.documentElement.style.setProperty('--bg-app', theme.bgBase);
    document.documentElement.style.setProperty('--bg-app-top', theme.bgTop);
    document.documentElement.style.setProperty('--bg-app-bottom', theme.bgBottom);
    document.documentElement.style.setProperty('--bg-vignette', theme.bgVignette);
    document.documentElement.style.setProperty('--bg-gradient-angle', theme.bgGradientAngle);
    document.documentElement.style.setProperty('--bg-ambient-primary-layer', theme.bgAmbientPrimaryLayer);
    document.documentElement.style.setProperty('--bg-ambient-secondary-layer', theme.bgAmbientSecondaryLayer);
    document.documentElement.style.setProperty('--bg-ambient-tertiary-layer', theme.bgAmbientTertiaryLayer);
    document.documentElement.style.setProperty('--bg-ambient-overlay-primary', theme.bgAmbientOverlayPrimary);
    document.documentElement.style.setProperty('--bg-ambient-overlay-secondary', theme.bgAmbientOverlaySecondary);
    document.documentElement.style.setProperty('--bg-ambient-overlay-highlight', theme.bgAmbientOverlayHighlight);

    localStorage.setItem('app_accent', accentColor);
  }, [accentColor, backgroundSeed]);

  useEffect(() => {
    localStorage.setItem('app_bg_seed', backgroundSeed.toString());
  }, [backgroundSeed]);

  useEffect(() => {
    const scale = Number(borderRadius);
    document.documentElement.style.setProperty('--radius-sm', `${8 * scale}px`);
    document.documentElement.style.setProperty('--radius-md', `${12 * scale}px`);
    document.documentElement.style.setProperty('--radius-lg', `${18 * scale}px`);
    document.documentElement.style.setProperty('--radius-xl', `${24 * scale}px`);
    document.documentElement.style.setProperty('--radius-2xl', `${32 * scale}px`);
    document.documentElement.style.setProperty('--radius-full', `${32 * scale}px`);

    localStorage.setItem('app_radius', scale.toString());
  }, [borderRadius]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

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
            <Route
              path="/settings"
              element={
                <Settings
                  accentColor={accentColor}
                  setAccentColor={setAccentColor}
                  shuffleBackground={() => setBackgroundSeed(createRandomSeed())}
                  borderRadius={borderRadius}
                  setBorderRadius={setBorderRadius}
                />
              }
            />
            <Route path="/account/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/account/password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
            <Route path="/account/delete" element={<ProtectedRoute><DeleteAccount /></ProtectedRoute>} />
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

      <AuthModal />
    </div>
  );
}
