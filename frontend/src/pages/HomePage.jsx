import { useEffect, useState } from "react";
import { getAllVideos } from "../api/videos.js";
import VideoCard from "../components/VideoCard.jsx";
import { getApiErrorMessage } from "../utils/helpers.js";

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVideos = async (search = "") => {
    setLoading(true);
    setError("");
    try {
      const response = await getAllVideos({ query: search, limit: 20 });
      setVideos(response.data?.vedios || response.data?.videos || []);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load videos"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchVideos(query.trim());
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Discover videos</h1>
          <p className="muted">Browse uploads from creators on your platform.</p>
        </div>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Search videos..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" className="btn btn--primary">
            Search
          </button>
        </form>
      </div>

      {loading && <p className="muted">Loading videos...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && videos.length === 0 && (
        <div className="empty-state">
          <h2>No videos yet</h2>
          <p>Upload your first video to get started.</p>
        </div>
      )}

      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </section>
  );
}
