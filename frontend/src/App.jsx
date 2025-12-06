import { useState } from "react";
import "./App.css";
function App() {
  const [query, setQuery] = useState("");
  const API_KEY = import.meta.env.VITE_TMDB_KEY;
  const [results, setResults] = useState([]);
  const searchMovie = async () => {
  if (!query) return;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    setResults(data.results);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

  return (
    <div className="container">
      <div className="iconBar">
      <div className="iconButton"><i className="fa-solid fa-house"></i></div>
      <div className="iconButton"><i className="fa-solid fa-star"></i></div>
      <div className="iconButton"><i className="fa-solid fa-bookmark"></i></div>
      <div className="iconButton"><i className="fa-solid fa-user"></i></div>
      <div className="iconButton"><i className="fa-solid fa-gear"></i></div>
      </div>
      <h1 className="title">Movie Tracker</h1>
      <p className="subtitle">Your Movie List and AI Movie Recommendation Website</p>
      <div className="searchBox">
        <input type="text" placeholder="Enter the movie name... " onChange={(e) => setQuery(e.target.value)} className="searchInput"/>
        <button onClick={searchMovie}  className="searchButton"><i className="fa-solid fa-search"></i><label>Search</label></button>
      </div>
      <p className="typedText">Searched for : {query}</p>
      <div className="resultsGrid">
        {results.map(movie => (
          <div className="movieCard" key={movie.id}>
          <img 
          src={
            movie.poster_path 
              ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` 
              : "/no-poster.png"
            }
            alt={movie.title}/>
          <p>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;