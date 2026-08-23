import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addComment,
  deleteComment,
  getVideoComments,
} from "../api/comments.js";
import { toggleVideoLike } from "../api/likes.js";
import { toggleSubscription } from "../api/subscriptions.js";
import { getVideoById } from "../api/videos.js";
import { useAuth } from "../context/AuthContext.jsx";
import {
  formatViews,
  getApiErrorMessage,
  getVideoUrl,
} from "../utils/helpers.js";
import AskWithAI from "../components/AskWithAI.jsx";

export default function VideoPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const [showAI, setShowAI] = useState(false);

  const loadVideoData = async () => {
    setLoading(true);
    setError("");
    try {
      const [videoRes, commentsRes] = await Promise.all([
        getVideoById(id),
        getVideoComments(id),
      ]);
      setVideo(videoRes.data);
      setComments(commentsRes.data?.comments || []);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load video"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideoData();
  }, [id]);

  const handleLike = async () => {
    try {
      await toggleVideoLike(id);
      setActionMessage("Like updated");
    } catch (err) {
      setActionMessage(getApiErrorMessage(err, "Could not update like"));
    }
  };

  const handleSubscribe = async () => {
    if (!video?.owner?._id) return;
    try {
      await toggleSubscription(video.owner._id);
      setActionMessage("Subscription updated");
    } catch (err) {
      setActionMessage(getApiErrorMessage(err, "Could not update subscription"));
    }
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) return;

    try {
      await addComment(id, commentText.trim());
      setCommentText("");
      const commentsRes = await getVideoComments(id);
      setComments(commentsRes.data?.comments || []);
    } catch (err) {
      setActionMessage(getApiErrorMessage(err, "Could not post comment"));
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((item) => item._id !== commentId));
    } catch (err) {
      setActionMessage(getApiErrorMessage(err, "Could not delete comment"));
    }
  };

  if (loading) {
    return <p className="muted">Loading video...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  const videoUrl = getVideoUrl(video);

  return (
    <section className="page video-page">
      <div className="video-player card">
        {videoUrl ? (
          <video controls src={videoUrl} className="video-player__media" />
        ) : (
          <div className="video-player__placeholder">Video unavailable</div>
        )}
      </div>

      <div className="video-details">
        <h1>{video.title}</h1>
        <p className="muted">
          {video.owner?.fullname} · {formatViews(video.views)}
        </p>
        <p>{video.description || video.discription}</p>

        <div className="action-row">
          <button
            type="button"
            className="btn btn--primary"
            onClick={handleLike}
          >
            Like
          </button>

          {video.owner?._id !== user?._id && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleSubscribe}
            >
              Subscribe
            </button>
          )}

          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setShowAI((prev) => !prev)}
          >
            🤖 Ask with AI
          </button>
        </div>

        {actionMessage && <p className="muted">{actionMessage}</p>}
      </div>

      {showAI && (
        <AskWithAI
          videoId={id}
          onClose={() => setShowAI(false)}
        />
      )}

      <div className="comments card">
        <h2>Comments</h2>
        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder="Add a comment..."
            rows={3}
          />
          <button type="submit" className="btn btn--primary">
            Post comment
          </button>
        </form>

        <div className="comment-list">
          {comments.length === 0 && <p className="muted">No comments yet.</p>}
          {comments.map((comment) => (
            <article key={comment._id} className="comment-item">
              <div className="comment-item__header">
                {comment.owner?.avatar && (
                  <img
                    src={comment.owner.avatar}
                    alt={comment.owner.username}
                    className="avatar avatar--sm"
                  />
                )}
                <strong>@{comment.owner?.username || comment.user?.username || "user"}</strong>
              </div>
              <p>{comment.comment || comment.content}</p>
              {(comment.owner?._id === user?._id || comment.user?._id === user?._id) && (
                <button
                  type="button"
                  className="btn btn--ghost btn--small"
                  onClick={() => handleDeleteComment(comment._id)}
                >
                  Delete
                </button>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
