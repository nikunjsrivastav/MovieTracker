import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { useAuth } from './auth.jsx';

const WatchlistContext = createContext();
const GUEST_STORAGE_KEY = 'movietracker_watchlist_guest';

function getStorageKey(user) {
  return user?.id ? `movietracker_watchlist_user_${user.id}` : GUEST_STORAGE_KEY;
}

export function WatchlistProvider({ children }) {
  const { user, isAuthenticated, isAuthReady } = useAuth();
  const [watchlist, setWatchlist] = useState({});
  const storageKey = useMemo(() => getStorageKey(isAuthenticated ? user : null), [isAuthenticated, user]);
  const previousAuthStateRef = React.useRef(false);

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    if (previousAuthStateRef.current && !isAuthenticated) {
      localStorage.removeItem(GUEST_STORAGE_KEY);
      setWatchlist({});
      previousAuthStateRef.current = isAuthenticated;
      return;
    }

    try {
      const data = localStorage.getItem(storageKey);
      setWatchlist(data ? JSON.parse(data) : {});
    } catch (e) {
      console.error('Error loading watchlist', e);
      setWatchlist({});
    }
    previousAuthStateRef.current = isAuthenticated;
  }, [isAuthReady, storageKey]);

  const save = (newList) => {
    setWatchlist(newList);
    localStorage.setItem(storageKey, JSON.stringify(newList));
  };

  const addMovie = (movie, status = 'plan_to_watch', rating = 0) => {
    const newList = { ...watchlist, [movie.id]: { ...movie, status, rating, added_at: new Date().toISOString(), updated_at: new Date().toISOString() } };
    save(newList);
  };

  const removeMovie = (id) => {
    const newList = { ...watchlist };
    delete newList[id];
    save(newList);
  };

  const updateStatus = (id, status) => {
    if (watchlist[id]) {
      const newList = { ...watchlist, [id]: { ...watchlist[id], status, updated_at: new Date().toISOString() } };
      save(newList);
    }
  };

  const updateRating = (id, rating) => {
    if (watchlist[id]) {
      const newList = { ...watchlist, [id]: { ...watchlist[id], rating, updated_at: new Date().toISOString() } };
      save(newList);
    }
  };

  const getMovie = (id) => watchlist[id] || null;
  const isTracked = (id) => !!watchlist[id];
  const getAll = () => Object.values(watchlist);
  const getByStatus = (status) => getAll().filter(m => m.status === status);

  const getStats = () => {
    const all = getAll();
    const stats = {
      total: all.length,
      watching: all.filter(m => m.status === 'watching').length,
      completed: all.filter(m => m.status === 'completed').length,
      plan_to_watch: all.filter(m => m.status === 'plan_to_watch').length,
      on_hold: all.filter(m => m.status === 'on_hold').length,
      favourites: all.filter(m => m.status === 'favourites').length,
      dropped: all.filter(m => m.status === 'dropped').length,
      avgRating: 0
    };
    const rated = all.filter(m => m.rating > 0);
    if (rated.length > 0) {
      const sum = rated.reduce((acc, m) => acc + m.rating, 0);
      stats.avgRating = (sum / rated.length).toFixed(1);
    }
    return stats;
  };

  const exportData = () => JSON.stringify(watchlist, null, 2);
  const importData = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        save(data);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const clearAll = () => {
    save({});
  };

  const storageScopeLabel = isAuthenticated
    ? `Signed in as ${user?.email}`
    : 'Signed out / guest mode';

  const watchlistPersistenceNote = isAuthenticated
    ? 'Your watchlist is linked to this signed-in account on this browser. Logging out clears it from the visible UI, and it returns when this same account signs back in here.'
    : 'You are in guest mode. Signed-out watchlist data is not shared with signed-in accounts.';

  return (
    <WatchlistContext.Provider value={{
      watchlist,
      addMovie,
      removeMovie,
      updateStatus,
      updateRating,
      getMovie,
      isTracked,
      getAll,
      getByStatus,
      getStats,
      exportData,
      importData,
      clearAll,
      storageKey,
      storageScopeLabel,
      watchlistPersistenceNote,
    }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  return useContext(WatchlistContext);
}
