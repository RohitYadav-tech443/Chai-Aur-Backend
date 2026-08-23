import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { publishVideo } from "../api/videos.js";
import { getApiErrorMessage } from "../utils/helpers.js";

export default function UploadVideoPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "" });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Upload Video | ChaiTube";
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!videoFile) {
      setError("Please select a video file");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("videoFile", videoFile);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    setLoading(true);
    try {
      const response = await publishVideo(formData);
      const videoId = response.data?._id;
      navigate(videoId ? `/video/${videoId}` : "/");
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to upload video"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page page--narrow">
      <div className="page-header">
        <div>
          <h1>Upload video</h1>
          <p className="muted">Share a new video with your audience.</p>
        </div>
      </div>

      <form className="card form-card" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            type="text"
            name="title"
            value={form.title}
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
            rows={5}
            required
          />
        </label>

        <label>
          Video file
          <input
            type="file"
            accept="video/*"
            onChange={(event) => setVideoFile(event.target.files?.[0] || null)}
            required
          />
        </label>

        <label>
          Thumbnail (optional)
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setThumbnail(event.target.files?.[0] || null)}
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? "Uploading..." : "Publish video"}
        </button>
      </form>
    </section>
  );
}
