import { Link } from "react-router-dom";
import { formatViews, getThumbnailUrl } from "../utils/helpers.js";

export default function VideoCard({ video }) {
  const thumbnail = getThumbnailUrl(video);

  return (
    <Link to={`/video/${video._id}`} className="video-card">
      <div className="video-card__thumb">
        {thumbnail ? (
          <img src={thumbnail} alt={video.title} />
        ) : (
          <div className="video-card__placeholder">No thumbnail</div>
        )}
      </div>
      <div className="video-card__info">
        <h3>{video.title}</h3>
        <p className="muted">
          {video.owner?.fullname || "Unknown creator"} · {formatViews(video.views)}
        </p>
        <p className="video-card__desc">{video.description || video.discription}</p>
      </div>
    </Link>
  );
}
