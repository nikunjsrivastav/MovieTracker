import { useState, useRef, useEffect } from "react";
export default function SettingsDropdown({ theme, setTheme }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);
  return (
    <div className="dropdownWrapper" ref={ref}>
      <div className="iconButton" onClick={() => setOpen(!open)}>
        <i className="fa-solid fa-gear"></i>
      </div>
      {open && (
        <div className="settingsDropdown">
  <button className="dropdownItem" onClick={toggleTheme}>
    <i className="fa-solid fa-circle-half-stroke"></i>
    <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
  </button>

  <button className="dropdownItem">
    <i className="fa-solid fa-broom"></i>
    <span>Clear History</span>
  </button>

  <button className="dropdownItem">
    <i className="fa-solid fa-circle-question"></i>
    <span>Help</span>
  </button>

  <button className="dropdownItem logout">
    <i className="fa-solid fa-arrow-right-from-bracket"></i>
    <span>Logout</span>
  </button>
</div>

      )}
    </div>
  );
}
