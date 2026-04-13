import React, { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const STORAGE_KEY = 'movietracker_watchlist';
  const [watchlist, setWatchlist] = useState({});

  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) setWatchlist(JSON.parse(data));
    } catch (e) {
      console.error('Error loading watchlist', e);
    }
  }, []);

  const save = (newList) => {
    setWatchlist(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
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
      if (typeof data === 'object') {
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
      clearAll
    }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  return useContext(WatchlistContext);
}
