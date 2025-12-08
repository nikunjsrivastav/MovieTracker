import { Routes, Route, Navigate } from "react-router-dom";
import { useState,useEffect} from "react";
import Home from "./Home.jsx";
import Results from "./Results.jsx";
import MovieDetails from "./MovieDetails.jsx";
import WatchList from "./WatchList.jsx";
import Layout from "./components/Layout.jsx";
export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
    useEffect(() => {
      document.body.className = theme;
      localStorage.setItem("theme", theme);
    }, [theme]);
  return (
    <Layout>
    <Routes>
      <Route path="/" element={<Home theme={theme} setTheme={setTheme}/>} />
      <Route path="/results" element={<Results theme={theme} setTheme={setTheme}/>} />
      <Route path="/movie/:id" element={<MovieDetails theme={theme} setTheme={setTheme} />}/>
      <Route path="/watchlist" element={<WatchList theme={theme} setTheme={setTheme} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Layout>
  );
}
