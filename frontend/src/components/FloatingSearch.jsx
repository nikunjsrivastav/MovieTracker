import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveSearch, getSearchHistory } from "./SearchHistory";
export default function FloatingSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (open) {
      const history = getSearchHistory();
      setRecent(history.length > 0 ? history[0] : null);
    }
  }, [open]);
  if (location.pathname === "/") return null;
  const goToResults = () => {
    if (!query.trim()) return;
    saveSearch(query);
    navigate(`/results?query=${query}`);
    setQuery("");
    setOpen(false);
  };
  return (
    <>
      <button
        className="floatingSearchBtn"
        onClick={() => setOpen(!open)}
      >
        <i className="fa-solid fa-search"></i>
      </button>

      {open && (
        <div className="floatingSearchBox">
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && goToResults()}
            autoFocus
          />
          <button onClick={goToResults}>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
          {recent && (
            <div className="searchHistory">
              <div
                className="historyItem"
                onClick={() => {
                  saveSearch(recent);
                  navigate(`/results?query=${recent}`);
                  setOpen(false);
                }}
              >
                <i className="fa-solid fa-clock-rotate-left"></i>
                {recent}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
