import { useState, useRef, useEffect } from "react";

export default function StatusDropdown({ status, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const STATUS_OPTIONS = [
    { key: "watching", label: "Watching", icon: "fa-solid fa-eye" },
    { key: "completed", label: "Completed", icon: "fa-solid fa-check" },
    { key: "plan", label: "Plan to Watch", icon: "fa-solid fa-clock" },
    { key: "onhold", label: "On Hold", icon: "fa-solid fa-pause" },
    { key: "dropped", label: "Dropped", icon: "fa-solid fa-xmark" },
    { key: "favorites", label: "Favorites", icon: "fa-solid fa-heart" }
  ];
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = STATUS_OPTIONS.find(opt => opt.key === status);

  return (
    <div className="dropdownWrapper" ref={ref}>
      <div className="statusButton" onClick={() => setOpen(!open)}>
        <i className={selected.icon}></i>
        <label>{selected.label}</label>
        <i className="fa-solid fa-angle-down" style={{ marginLeft: "auto" }}></i>
      </div>
      {open && (
        <div className="statusDropdownMenu">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.key}
              className="dropdownItem"
              onClick={() => {
                onChange(opt.key);
                setOpen(false);
              }}
            >
              <i className={opt.icon}></i>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
