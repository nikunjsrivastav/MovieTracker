import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FloatingSearch from "./components/FloatingSearch";
import IconBar from "./components/IconBar";
export default function Results({theme,setTheme}) {
  const API_KEY = import.meta.env.VITE_TMDB_KEY;
  const [results, setResults] = useState([]);
  const { search } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const query = new URLSearchParams(search).get("query");
  useEffect(() => {
    if (!query) return;
    const fetchMovies = async () => {
      setLoading(true);
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`;
      const res = await fetch(url);
      const data = await res.json();
      const sorted = (data.results || []).sort((a, b) => {
      const aHasPoster = a.poster_path ? 1 : 0;
      const bHasPoster = b.poster_path ? 1 : 0;
      return bHasPoster - aHasPoster;});
      setResults(sorted);
      setLoading(false);
    };
    fetchMovies();
  }, [query]);
  return (
    <div className="container resultsPage">
      <FloatingSearch/>
      <div className="backButton" onClick={() => navigate(-1)}><i className="fa-solid fa-arrow-left"></i></div>
      <IconBar theme={theme} setTheme={setTheme}/>
      <label className="resultsTitle">
        Search results for: <b>{query}</b>
      </label>
      {!loading && results.length === 0 && (
        <div className="emptyState">
          <p>No movies found for <b>{query}</b></p>
          <span>Try searching with a different name</span>
         </div>)}
      {results.length > 0 && (
        <div className="resultsGrid">
          {results.map(movie => (
            <div className="movieCard" key={movie.id} onClick={() => navigate(`/movie/${movie.id}`)}>
            <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : "/no-poster.png"}
            alt={movie.title}/>
            <p>{movie.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}