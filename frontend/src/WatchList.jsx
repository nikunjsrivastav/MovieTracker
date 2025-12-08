import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SettingsDropdown from "./SettingsDropdown";
export default function WatchList({ theme, setTheme }) {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setList(stored);
  }, []);
  const removeFromList = (id) => {
    const updated = list.filter(item => item.id !== id);
    setList(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };
  return (
    <div className="container resultsPage">
      <div className="backButton" onClick={() => navigate(-1)}><i className="fa-solid fa-arrow-left"></i></div>
      <div className="iconBar">
              <div className="iconButton" onClick={() => navigate("/")}>
                <i className="fa-solid fa-house"></i>
              </div>
              <div className="iconButton" onClick={() => navigate("/Recommended")}><i className="fa-solid fa-star"></i></div>
              <div className="iconButton"onClick={() => navigate("/WatchList")}><i className="fa-solid fa-bookmark"></i></div>
              <div className="iconButton"onClick={() => navigate("/Account")}><i className="fa-solid fa-user"></i></div>
              <SettingsDropdown theme={theme} setTheme={setTheme} />
        </div>
    
      <h2 className="resultsTitle">Your Watchlist</h2>
      {list.length === 0 && (
        <p style={{ opacity: 0.6 }}>Your watchlist is empty.</p>
      )}
      <div className="resultsGrid">
        {list.map(movie => (
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
