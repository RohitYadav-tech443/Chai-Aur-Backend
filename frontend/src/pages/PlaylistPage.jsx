import { useEffect, useState } from "react";
import {
  createPlaylist,
  deletePlaylist,
  getUserPlaylists,
} from "../api/playlists.js";
import { useAuth } from "../context/AuthContext.jsx";
import { getApiErrorMessage } from "../utils/helpers.js";

export default function PlaylistPage() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadPlaylists = async () => {
    if (!user?._id) return;
    setLoading(true);
    setError("");
    try {
      const response = await getUserPlaylists(user._id);
      setPlaylists(response.data || []);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load playlists"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, [user?._id]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await createPlaylist(form);
      setForm({ name: "", description: "" });
      setMessage("Playlist created");
      loadPlaylists();
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to create playlist"));
    }
  };

  const handleDelete = async (playlistId) => {
    try {
      await deletePlaylist(playlistId);
      setPlaylists((prev) => prev.filter((item) => item._id !== playlistId));
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to delete playlist"));
    }
  };

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Your playlists</h1>
          <p className="muted">Organize videos into collections.</p>
        </div>
      </div>

      <form className="card form-card page--narrow" onSubmit={handleCreate}>
        <h2>Create playlist</h2>
        <label>
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            required
          />
        </label>
        <button type="submit" className="btn btn--primary">
          Create playlist
        </button>
      </form>

      {message && <p className="success-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}
      {loading && <p className="muted">Loading playlists...</p>}

      <div className="playlist-grid">
        {playlists.map((playlist) => (
          <article key={playlist._id} className="card playlist-card">
            <h3>{playlist.name}</h3>
            <p className="muted">{playlist.description}</p>
            <p>{playlist.videos?.length || 0} videos</p>
            <button
              type="button"
              className="btn btn--ghost btn--small"
              onClick={() => handleDelete(playlist._id)}
            >
              Delete
            </button>
          </article>
        ))}
      </div>

      {!loading && playlists.length === 0 && (
        <div className="empty-state">
          <h2>No playlists yet</h2>
          <p>Create your first playlist above.</p>
        </div>
      )}
    </section>
  );
}
