import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useWatchlist } from '../store/watchlist.jsx';
import { useAuth } from '../store/auth.jsx';

const ICONS = {
  home: <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  mylist: <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  settings: <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  trending: <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c0 0-4 4-4 8a4 4 0 0 0 8 0c0-4-4-8-4-8z"/><path d="M12 22a8 8 0 0 1-8-8c0-3 2-6 2-6s1 3 4 3 4-5 4-5 1 3 4 5 2 6 2 6a8 8 0 0 1-8 8z"/></svg>,
  genres: <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  popular: <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  top_rated: <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  now_playing: <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  dot: <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="currentColor"></circle></svg>,
  watching: <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path d="M247.31,124.76c-4.22-5.12-51.57-60.76-119.31-60.76S12.91,119.64,8.69,124.76a8,8,0,0,0,0,6.48c4.22,5.12,51.57,60.76,119.31,60.76s115.09-55.64,119.31-60.76A8,8,0,0,0,247.31,124.76ZM128,176a48,48,0,1,1,48-48A48.06,48.06,0,0,1,128,176Zm0-80a32,32,0,1,0,32,32A32,32,0,0,0,128,96Z" fill="currentColor"></path></svg>,
  completed: <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" fill="currentColor"></path></svg>,
  plan_to_watch: <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" fill="currentColor"></path></svg>,
  on_hold: <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path d="M112,64V192a8,8,0,0,1-16,0V64a8,8,0,0,1,16,0Zm48-8a8,8,0,0,0-8,8V192a8,8,0,0,0,16,0V64A8,8,0,0,0,160,56Z" fill="currentColor"></path></svg>,
  dropped: <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" fill="currentColor"></path></svg>,
  favourites: <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path d="M240,94c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,220.66,16,164,16,94A62.07,62.07,0,0,1,78,32c22.59,0,41.94,17.31,50,32,8.06-14.69,27.41-32,50-32A62.07,62.07,0,0,1,240,94Z" fill="currentColor"></path></svg>,
  account: <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path d="M128,24a56,56,0,1,0,56,56A56.06,56.06,0,0,0,128,24Zm0,96a40,40,0,1,1,40-40A40,40,0,0,1,128,120Zm0,24c-44.11,0-80,26.91-80,60a8,8,0,0,0,16,0c0-23.52,29.91-44,64-44s64,20.48,64,44a8,8,0,0,0,16,0C208,170.91,172.11,144,128,144Z" fill="currentColor"></path></svg>,
  logo: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/></svg>,
  collapse: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  expand: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
};

const MENU_ITEMS = [
  { id: 'home', icon: ICONS.home, label: 'Home' },
  { id: 'mylist', icon: ICONS.mylist, label: 'My List' },
  { id: 'settings', icon: ICONS.settings, label: 'User Settings' },
];

const BROWSE_ITEMS = [
  { id: 'trending', icon: ICONS.trending, label: 'Trending' },
  { id: 'genres', icon: ICONS.genres, label: 'Genres' },
  { id: 'popular', icon: ICONS.popular, label: 'Popular' },
  { id: 'top_rated', icon: ICONS.top_rated, label: 'Top Rated' },
  { id: 'now_playing', icon: ICONS.now_playing, label: 'Now Playing' },
];

const ACCOUNT_ITEMS = [
  { id: 'profile', label: 'View Profile', to: '/account/profile' },
  { id: 'edit', label: 'Edit Profile', to: '/account/edit' },
  { id: 'password', label: 'Change Password', to: '/account/password' },
  { id: 'delete', label: 'Delete Account', to: '/account/delete' },
];

export default function Sidebar({ isCollapsed, onToggleSidebar }) {
  const { getStats } = useWatchlist();
  const stats = getStats();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const navRef = useRef(null);

  const checkScroll = () => {
    if (navRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = navRef.current;
      setIsScrolled(scrollTop > 0);
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleNavClick = () => {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('mobile-overlay')?.classList.remove('active');
  };

  const NavItem = ({ to, icon, label, badge, customColor }) => {
    return (
      <NavLink 
        to={to}
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        onClick={handleNavClick}
        title={isCollapsed ? label : ''}
        end={to === '/'}
      >
        <span className="nav-icon" style={customColor ? { color: customColor } : {}}>
          {icon}
        </span>
        <span>{label}</span>
        {badge > 0 && <span className="nav-badge">{badge}</span>}
      </NavLink>
    );
  };

  return (
    <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">

      <nav className="sidebar-nav" ref={navRef} onScroll={checkScroll}>
        <div className="sidebar-group">
          {MENU_ITEMS.map(item => {

            return (
              <NavItem
                key={item.id}
                to={item.id === 'home' ? '/' : `/${item.id}`}
                icon={item.icon}
                label={item.label}
                badge={item.id === 'mylist' ? stats.total : 0}
                customColor=""
              />
            );
          })}
        </div>

        <div className="sidebar-group">
          <div className="sidebar-section-title" style={{ marginTop: 'var(--space-md)' }}>Browse</div>
          {BROWSE_ITEMS.map(item => (
            <NavItem 
              key={item.id} 
              to={item.id === 'genres' ? '/genres' : `/browse/${item.id}`} 
              icon={item.icon} 
              label={item.label} 
              customColor="" 
            />
          ))}
        </div>

        <div className="sidebar-group">
          <div className="sidebar-section-title" style={{ marginTop: 'var(--space-md)' }}>Tracking</div>
          <NavItem to="/mylist/watching" icon={ICONS.watching} label="Watching" badge={stats.watching} customColor="#0A84FF" />
          <NavItem to="/mylist/completed" icon={ICONS.completed} label="Completed" badge={stats.completed} customColor="#30D158" />
          <NavItem to="/mylist/plan_to_watch" icon={ICONS.plan_to_watch} label="Plan to Watch" badge={stats.plan_to_watch} customColor="#FF9F0A" />
          <NavItem to="/mylist/on_hold" icon={ICONS.on_hold} label="On Hold" badge={stats.on_hold} customColor="#FFD60A" />
          <NavItem to="/mylist/dropped" icon={ICONS.dropped} label="Dropped" badge={stats.dropped} customColor="#FF453A" />
          <NavItem to="/mylist/favourites" icon={ICONS.favourites} label="Favourites" badge={stats.favourites} customColor="#BF5AF2" />
        </div>
      </nav>

    </aside>
  );
}
