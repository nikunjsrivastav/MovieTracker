import { useNavigate, useLocation } from "react-router-dom";
import SettingsDropdown from "./SettingsDropdown";

export default function IconBar({ theme, setTheme }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="iconBar">
      <div
        className={`iconButton ${isActive("/") ? "active" : ""}`}
        onClick={() => navigate("/")}>
        <i className="fa-solid fa-house"></i>
      </div>

      <div
        className={`iconButton ${isActive("/Recommended") ? "active" : ""}`}
        onClick={() => navigate("/Recommended")}>
        <i className="fa-solid fa-star"></i>
      </div>

      <div
        className={`iconButton ${isActive("/WatchList") ? "active" : ""}`}
        onClick={() => navigate("/WatchList")}>
        <i className="fa-solid fa-bookmark"></i>
      </div>

      <div
        className={`iconButton ${isActive("/Account") ? "active" : ""}`}
        onClick={() => navigate("/Account")}>
        <i className="fa-solid fa-user"></i>
      </div>

      <SettingsDropdown theme={theme} setTheme={setTheme} />
    </div>
  );
}
