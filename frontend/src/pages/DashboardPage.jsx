import { useEffect, useState } from "react";
import { getChannelStats, getChannelVideos } from "../api/dashboard.js";
import VideoCard from "../components/VideoCard.jsx";
import { getApiErrorMessage } from "../utils/helpers.js";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");
      try {
        const [statsRes, videosRes] = await Promise.all([
          getChannelStats(),
          getChannelVideos(),
        ]);
        setStats(statsRes.data);
        setVideos(videosRes.data || []);
      } catch (err) {
        setError(getApiErrorMessage(err, "Failed to load dashboard"));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <p className="muted">Loading dashboard...</p>;
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Creator dashboard</h1>
          <p className="muted">Track performance for your channel.</p>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      {stats && (
        <div className="stats-grid">
          <article className="card stat-card">
            <span className="muted">Videos</span>
            <strong>{stats.totalVideos}</strong>
          </article>
          <article className="card stat-card">
            <span className="muted">Views</span>
            <strong>{stats.totalViews}</strong>
          </article>
          <article className="card stat-card">
            <span className="muted">Subscribers</span>
            <strong>{stats.totalSubscribers}</strong>
          </article>
          <article className="card stat-card">
            <span className="muted">Likes</span>
            <strong>{stats.totalLikes}</strong>
          </article>
        </div>
      )}

      <div className="section-block">
        <h2>Your uploaded videos</h2>
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
        {videos.length === 0 && <p className="muted">No uploaded videos yet.</p>}
      </div>
    </section>
  );
}
