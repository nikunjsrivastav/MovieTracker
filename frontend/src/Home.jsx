import { useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import SettingsDropdown from "./SettingsDropdown";
export default function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      const bar = document.querySelector(".iconBar");
      if (window.scrollY > 24) {
      bar.classList.add("scrolled");
        } else {
      bar.classList.remove("scrolled");
        }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const goToResults = () => {
    if (!query) return;
    navigate(`/results?query=${query}`);
  };
  return (
    <div className="page">
    <div className="container">
      <div className="iconBar">
        <div className="iconButton" onClick={() => navigate("/")}>
          <i className="fa-solid fa-house"></i>
        </div>
        <div className="iconButton" onClick={() => navigate("/Recommended")}><i className="fa-solid fa-star"></i></div>
        <div className="iconButton"onClick={() => navigate("/WatchList")}><i className="fa-solid fa-bookmark"></i></div>
        <div className="iconButton"onClick={() => navigate("/Account")}><i className="fa-solid fa-user"></i></div>
        <SettingsDropdown />
      </div>
      <h1 className="title">Movie Tracker</h1>
      <p className="subtitle">Your Movie List and AI Movie Recommendation Website</p>
      <div className="searchBox">
        <input 
          type="text"
          placeholder="Enter the movie name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="searchInput"
        />
        <button className="searchButton" onClick={goToResults}>
          <i className="fa-solid fa-search"></i>
          <label>Search</label>
        </button>
      </div>
    </div>
    </div>
  );
}
