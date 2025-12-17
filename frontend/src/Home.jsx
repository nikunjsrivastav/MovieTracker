import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveSearch, getSearchHistory } from "./components/SearchHistory";
import IconBar from "./components/IconBar";
export default function Home({theme,setTheme}) {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);
  const goToResults = () => {
    if (!query.trim()) return;
    saveSearch(query);
    navigate(`/results?query=${query}`);
  };
  return (
    <div className="container homePage">
      <IconBar theme={theme} setTheme={setTheme} />
      <div className="headingHome">
      <h1 className="title">Movie Tracker</h1>
      <p className="subtitle">Your Movie List and AI Movie Recommendation Website</p>
      <div className="searchBox">
        <input
          type="text"
          placeholder="Enter the movie name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setHistory(getSearchHistory())}
          onKeyDown={(e) => e.key === "Enter" && goToResults()}
          className="searchInput"
        />
        <button className="searchButton" onClick={goToResults}>
          <i className="fa-solid fa-search"></i>
          <label>Search</label>
        </button>
      </div>
      {history.length > 0 && (
        <div className="searchHistory">
              <div className="searchHistoryInner">
              {history.map((item, i) => (
                <div
                  key={i}
                  className="historyItem"
                  onClick={() => {
                    setQuery(item);
                    saveSearch(item);
                    navigate(`/results?query=${item}`);
                    setOpen(false);
                  }}
                >
                  <i className="fa-solid fa-clock-rotate-left"></i>
                  {item}
                </div>
              ))}
              </div>
          </div>
        )}
    </div>
    </div>
  );
}