const KEY = "searchHistory";
export const saveSearch = (query) => {
  if (!query.trim()) return;
  let history = JSON.parse(localStorage.getItem(KEY)) || [];
  history = history.filter(item => item !== query);
  history.unshift(query);
  localStorage.setItem(KEY, JSON.stringify(history));
};
export const getSearchHistory = () => {
  return JSON.parse(localStorage.getItem(KEY)) || [];
};
export const clearSearchHistory = () => {
  localStorage.removeItem(KEY);
};
