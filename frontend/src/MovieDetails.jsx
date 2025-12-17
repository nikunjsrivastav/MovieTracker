import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StatusDropdown from "./components/StatusDropdown";
import FloatingSearch from "./components/FloatingSearch";
import IconBar from "./components/IconBar";
export default function MovieDetails({ theme, setTheme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [status, setStatus] = useState("plan");
  const API_KEY = import.meta.env.VITE_TMDB_KEY;

  useEffect(() => {
    const current = JSON.parse(localStorage.getItem("watchlist") || "[]");
    const found = current.find(item => item.id === Number(id));

    if (found) {
      setAdded(true);
      setStatus(found.status || "plan");
    }
  }, [id]);

  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      setMovie(data);
    };
    fetchDetails();
  }, [id]);

  if (!movie) return <div>Loading...</div>;

  const addToList = () => {
    const current = JSON.parse(localStorage.getItem("watchlist") || "[]");
    const exists = current.find(item => item.id === movie.id);

    if (exists) {
      const updated = current.filter(item => item.id !== movie.id);
      localStorage.setItem("watchlist", JSON.stringify(updated));
      setAdded(false);
    } else {
      current.push({
        id: movie.id,
        title: movie.title,
        poster: movie.poster_path,
        rating: movie.vote_average,
        status: status
      });
      localStorage.setItem("watchlist", JSON.stringify(current));
      setAdded(true);
    }
  };

  const updateStatus = (newStatus) => {
    setStatus(newStatus);

    const current = JSON.parse(localStorage.getItem("watchlist") || "[]");
    const exists = current.find(item => item.id === movie.id);

    if (exists) {
      const updated = current.map(item =>
        item.id === movie.id ? { ...item, status: newStatus } : item
      );

      localStorage.setItem("watchlist", JSON.stringify(updated));
    }
  };

  return (
    <div className="container moviePage">
      <FloatingSearch/>
      <div className="backButton" onClick={() => navigate(-1)}><i className="fa-solid fa-arrow-left"></i></div>
      <IconBar theme={theme} setTheme={setTheme}/>
      <div className="movieLayout">
        
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          className="posterImage"
          alt={movie.title}
        />

        <div className="infoSection">
          <h1 className="movieTitle">{movie.title}</h1>

          <div className="tagRow">
            {movie.genres?.map(g => (
              <span key={g.id} className="tag">{g.name}</span>
            ))}
          </div>

          <div className="metaRow">
            <span>{movie.release_date?.slice(0,4)}</span>
            <span>•</span>
            <span>{movie.runtime} min</span>
            <span>•</span>
            <span>⭐ {movie.vote_average?.toFixed(1)}</span>
          </div>

          <p className="overview">{movie.overview}</p>
          
          <button 
            className={`addBtn ${added ? "added" : ""}`}
            onClick={addToList}
          >
            {added ? (
              <label><i className="fa-solid fa-check"></i> Added (Click to Remove)</label>
            ) : (
              <label><i className="fa-solid fa-plus"></i> Add to Watchlist</label>
            )}
          </button>
          {added && (<StatusDropdown status={status} onChange={updateStatus} />)}
        </div>

        <div className="sideInfo">
          {movie.status && <p><b>Status:</b> {movie.status}</p>}
          {movie.original_language && (
            <p><b>Language:</b> {movie.original_language.toUpperCase()}</p>
          )}
          {movie.budget > 0 && (
            <p><b>Budget:</b> ${movie.budget.toLocaleString()}</p>
          )}
          {movie.revenue > 0 && (
            <p><b>Revenue:</b> ${movie.revenue.toLocaleString()}</p>
          )}

          <p><b>Production:</b></p>
          <div className="studioList">
            {movie.production_companies?.map(comp => (
              <span key={comp.id} className="studioTag">{comp.name}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
