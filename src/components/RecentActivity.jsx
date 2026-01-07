import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import { socket } from "../services/socket";

function timeAgo(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  const diff = Date.now() - d.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function RecentActivity({ limit = 6 }) {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  // carregar histórico
  useEffect(() => {
    const load = async () => {
      try {
        setErr("");
        const data = await apiRequest(`/activity?limit=${limit}`);
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setErr("Failed to load recent activity");
      }
    };
    load();
  }, [limit]);

  // realtime via socket
  useEffect(() => {
    const onNew = (activity) => {
      setItems((prev) => [activity, ...prev].slice(0, limit));
    };

    socket.on("activity:new", onNew);
    return () => socket.off("activity:new", onNew);
  }, [limit]);

  if (err) {
    return <p className="error-text">{err}</p>;
  }

  if (!items.length) {
    return <p style={{ margin: 0, opacity: 0.7 }}>No recent activity yet</p>;
  }

  return (
    <>
      {items.map((a) => (
        <div className="activity-item" key={a._id}>
          <div className="activity-line">
            <span className="activity-name">
              {a.actor?.name || a.actor?.email || "User"}
            </span>

            <span className="activity-action">{a.message}</span>

            {a.exercise?.title ? (
              <span className="activity-link">{a.exercise.title}</span>
            ) : null}
          </div>

          <div className="activity-time">{timeAgo(a.createdAt)}</div>
        </div>
      ))}
    </>
  );
}
