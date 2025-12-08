import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SettingsDropdown from "./SettingsDropdown";
export default function Results({theme,setTheme}) {
  const API_KEY = import.meta.env.VITE_TMDB_KEY;
  const [results, setResults] = useState([]);
  const { search } = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(search).get("query");
  useEffect(() => {
    const fetchMovies = async () => {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`;
      const res = await fetch(url);
      const data = await res.json();
      const sorted = data.results.sort((a, b) => {
      const aHasPoster = a.poster_path ? 1 : 0;
      const bHasPoster = b.poster_path ? 1 : 0;
      return bHasPoster - aHasPoster;});
      setResults(sorted);;
    };
    fetchMovies();
  }, [query]);
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
      <h2 className="resultsTitle">
        Search results for: <b>{query}</b>
      </h2>
      <div className="resultsGrid">
        {results.map(movie => (
          <div className="movieCard" key={movie.id} onClick={() => navigate(`/movie/${movie.id}`)}>
            <img 
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : "/no-poster.png"
              }
              alt={movie.title}
            />
            <p>{movie.title}</p>
          </div>
        ))}
      </div>

    </div>
  );
}