import { useEffect, useState } from "react";

export default function StatsSection() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("watchlist") || "[]");

    const total = list.length;
    const completed = list.filter(m => m.status === "completed").length;
    const watching = list.filter(m => m.status === "watching").length;
    const favorites = list.filter(m => m.status === "favorites").length;

    setStats({
      total,
      completed,
      watching,
      favorites,
      completionRate: total
        ? Math.round((completed / total) * 100)
        : 0
    });
  }, []);

  if (!stats) return null;

  return (
    <div className="statsSection">
      <h3 className="sectionTitle">Your Stats</h3>

      <div className="statGrid">
        <StatCard label="Total Movies" value={stats.total} />
        <StatCard label="Completed" value={stats.completed} />
        <StatCard label="Watching" value={stats.watching} />
        <StatCard label="Completion" value={`${stats.completionRate}%`} />
      </div>

      <div className="insightBox">
        {stats.completed === 0
          ? "Start watching movies to see insights 🎬"
          : `You've completed ${stats.completed} movies so far. Keep going 🚀`}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="statCard">
      <div className="statValue">{value}</div>
      <div className="statLabel">{label}</div>
    </div>
  );
}
