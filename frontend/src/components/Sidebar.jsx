import React from 'react';
import { useWatchlist } from '../store/watchlist.jsx';

const ICONS = {
  home: <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  mylist: <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  settings: <svg className="ico" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
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
  logo: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/></svg>,
  collapse: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  expand: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
};

const MENU_ITEMS = [
  { id: 'home', icon: ICONS.home, label: 'Home' },
  { id: 'mylist', icon: ICONS.mylist, label: 'My List' },
  { id: 'settings', icon: ICONS.settings, label: 'Settings' },
];

const BROWSE_ITEMS = [
  { id: 'popular', icon: ICONS.popular, label: 'Popular' },
  { id: 'top_rated', icon: ICONS.top_rated, label: 'Top Rated' },
  { id: 'now_playing', icon: ICONS.now_playing, label: 'Now Playing' },
];

export default function Sidebar({ currentPage, currentFilter, navigate, isCollapsed, onToggleSidebar }) {
  const { getStats } = useWatchlist();
  const stats = getStats();

  const handleNavClick = (page, filter) => {
    navigate(page, filter ? { filter } : {});
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('mobile-overlay')?.classList.remove('active');
  };

  const NavItem = ({ page, filter, icon, label, badge, customColor }) => {
    const isActive = (currentPage === page && !filter) || 
                     (currentPage === page && currentFilter === filter);

    return (
      <div 
        className={`nav-item ${isActive ? 'active' : ''}`} 
        onClick={() => handleNavClick(page, filter)}
        title={isCollapsed ? label : ''}
      >
        <span className="nav-icon" style={customColor ? { color: customColor } : {}}>
          {icon}
        </span>
        {!isCollapsed && <span>{label}</span>}
        {!isCollapsed && badge > 0 && <span className="nav-badge">{badge}</span>}
      </div>
    );
  };

  return (
    <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
      <div className={`sidebar-logo ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo-icon">
          {ICONS.logo}
        </div>
        {!isCollapsed && <h1>MovieTracker</h1>}
        <button 
          className="sidebar-toggle-btn" 
          onClick={onToggleSidebar}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? ICONS.expand : ICONS.collapse}
        </button>
      </div>
      <nav className="sidebar-nav">
        {!isCollapsed && <div className="sidebar-section-title">Menu</div>}
        {MENU_ITEMS.map(item => (
          <NavItem 
            key={item.id} 
            page={item.id} 
            icon={item.icon} 
            label={item.label} 
            badge={item.id === 'mylist' ? stats.total : 0} 
            customColor=""
          />
        ))}

        {!isCollapsed && <div className="sidebar-section-title" style={{ marginTop: 'var(--space-md)' }}>Browse</div>}
        {BROWSE_ITEMS.map(item => (
          <NavItem key={item.id} page={item.id} icon={item.icon} label={item.label} customColor="" />
        ))}

        {!isCollapsed && <div className="sidebar-section-title" style={{ marginTop: 'var(--space-md)' }}>Tracking</div>}
        <NavItem page="mylist" filter="watching" icon={ICONS.watching} label="Watching" badge={stats.watching} customColor="#0A84FF" />
        <NavItem page="mylist" filter="completed" icon={ICONS.completed} label="Completed" badge={stats.completed} customColor="#30D158" />
        <NavItem page="mylist" filter="plan_to_watch" icon={ICONS.plan_to_watch} label="Plan to Watch" badge={stats.plan_to_watch} customColor="#FF9F0A" />
        <NavItem page="mylist" filter="on_hold" icon={ICONS.on_hold} label="On Hold" badge={stats.on_hold} customColor="#FFD60A" />
        <NavItem page="mylist" filter="dropped" icon={ICONS.dropped} label="Dropped" badge={stats.dropped} customColor="#FF453A" />
        <NavItem page="mylist" filter="favourites" icon={ICONS.favourites} label="Favourites" badge={stats.favourites} customColor="#BF5AF2" />
      </nav>
    </aside>
  );
}
