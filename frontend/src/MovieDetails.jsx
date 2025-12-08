import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SettingsDropdown from "./SettingsDropdown";
export default function MovieDetails({ theme, setTheme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const API_KEY = import.meta.env.VITE_TMDB_KEY;
  useEffect(() => {
  const current = JSON.parse(localStorage.getItem("watchlist") || "[]");
  if (current.find(item => item.id === Number(id))) {
    setAdded(true);
  }}, [id]);
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
      rating: movie.vote_average
    });
    localStorage.setItem("watchlist", JSON.stringify(current));
    setAdded(true);
  }
};

  return (
    <div className="container moviePage">
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

          <button className={`addBtn ${added ? "added" : ""}`} onClick={addToList}>{added ? (<label><i className="fa-solid fa-check"></i> Added (Click to Remove)</label>) : (<label><i className="fa-solid fa-plus"></i> Add to Watchlist </label>)}</button>
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
