import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingsDropdown from "./components/SettingsDropdown";
import StatusDropdown from "./components/StatusDropdown";

export default function WatchList({ theme, setTheme }) {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [activeTab, setActiveTab] = useState("plan");
  const TABS = [
  { key: "plan", label: "Plan to Watch", icon: "fa-solid fa-clock" },
  { key: "watching", label: "Watching", icon: "fa-solid fa-play" },
  { key: "completed", label: "Completed", icon: "fa-solid fa-check" },
  { key: "onhold", label: "On Hold", icon: "fa-solid fa-pause" },
  { key: "dropped", label: "Dropped", icon: "fa-solid fa-xmark" },
  { key: "favorites", label: "Favorites", icon: "fa-solid fa-heart" }
    ];
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("watchlist") || "[]");
    const updated = stored.map(movie => ({
      ...movie,
      status: movie.status || "plan"
    }));
    localStorage.setItem("watchlist", JSON.stringify(updated));
    setList(updated);
  }, []);
  const removeFromList = id => {
    const updated = list.filter(item => item.id !== id);
    setList(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };
  const updateStatus = (id, newStatus) => {
    const updated = list.map(movie =>
      movie.id === id ? { ...movie, status: newStatus } : movie
    );
    setList(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };
  const filteredMovies = list.filter(movie => movie.status === activeTab);
  return (
    <div className="container resultsPage">

      <div className="backButton" onClick={() => navigate(-1)}>
        <i className="fa-solid fa-arrow-left"></i>
      </div>

      <div className="iconBar">
        <div className="iconButton" onClick={() => navigate("/")}>
          <i className="fa-solid fa-house"></i>
        </div>
        <div className="iconButton" onClick={() => navigate("/Recommended")}>
          <i className="fa-solid fa-star"></i>
        </div>
        <div className="iconButton" onClick={() => navigate("/WatchList")}>
          <i className="fa-solid fa-bookmark"></i>
        </div>
        <div className="iconButton" onClick={() => navigate("/Account")}>
          <i className="fa-solid fa-user"></i>
        </div>
        <SettingsDropdown theme={theme} setTheme={setTheme} />
      </div>

      <h2 className="resultsTitle">Your Watchlist</h2>
      <div className="tabs">
        {TABS.map(tab => (
        <button
        key={tab.key}
        className={`tabBtn ${activeTab === tab.key ? "active" : ""}`}
        onClick={() => setActiveTab(tab.key)}
        >
        <i className={tab.icon}></i>
        <span>{tab.label}</span>
        </button>
        ))}

      </div>
      {filteredMovies.length === 0 && (
        <p style={{ opacity: 0.6, marginTop: "16px" }}>
          Nothing here yet. Add some movies!
        </p>
      )}
      <div className="resultsGrid">
        {filteredMovies.map(movie => (
          <div className="movieCard" key={movie.id}>
            <div onClick={() => navigate(`/movie/${movie.id}`)}>
              <img
                src={
                  movie.poster
                    ? `https://image.tmdb.org/t/p/w300${movie.poster}`
                    : "/no-poster.png"
                }
                alt={movie.title}
              />
              <p>{movie.title}</p>
            </div>
            <StatusDropdown status={movie.status} onChange={(newStatus) => updateStatus(movie.id, newStatus)}/>
            <button
              className="removeButton"
              onClick={() => removeFromList(movie.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}