import { useState } from "react";
import "./App.css";
function App() {
  const [query, setQuery] = useState("");
  return (
    <div className="container">
      <h1 className="title">MovieTracker</h1>
      <p className="subtitle">Your AI Movie Recommendation Website</p>
      <div className="searchBox">
        <input type="text" placeholder="Enter the movie name... " onChange={(e) => setQuery(e.target.value)} className="searchInput"/>
        <button onClick={()=>alert("Searching for: "+query)} className="searchButton">Search</button>
      </div>
      <p className="typedText">You typed: {query}</p>
    </div>
  );
}

export default App;
