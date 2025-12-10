
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function FloatingSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/") return null;

  const goToResults = () => {
    if (!query.trim()) return;
    navigate(`/results?query=${query}`);
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <button
        className="floatingSearchBtn"
        onClick={() => setOpen(!open)}
      >
        <i className="fa-solid fa-search"></i>
      </button>
      {open && (
        <div className="floatingSearchBox">
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && goToResults()}
          />
          <button onClick={goToResults}>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      )}
    </>
  );
}
