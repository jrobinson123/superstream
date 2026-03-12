import { streamUrl } from "./api";

export default function Player({ video, onClose }) {
  if (!video) return null;

  return (
    <div className="player-overlay" onClick={onClose}>
      <div className="player-box" onClick={(e) => e.stopPropagation()}>
        <div className="player-header">
          <h2>{video.title}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <video
          key={video.id}
          controls
          autoPlay
          className="player-video"
          src={streamUrl(video.id)}
        />
      </div>
    </div>
  );
}
