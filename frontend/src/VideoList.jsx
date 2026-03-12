import { useEffect, useState } from "react";
import { getVideos, deleteVideo } from "./api";

export default function VideoList({ onSelect, refresh }) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getVideos().then(setVideos);
  }, [refresh]);

  async function handleDelete(e, id) {
    e.stopPropagation();
    await deleteVideo(id);
    setVideos((v) => v.filter((vid) => vid.id !== id));
  }

  if (videos.length === 0) {
    return <p className="empty">No videos yet. Upload one!</p>;
  }

  return (
    <ul className="video-list">
      {videos.map((v) => (
        <li key={v.id} className="video-item" onClick={() => onSelect(v)}>
          <span className="video-title">{v.title}</span>
          <span className="video-filename">{v.filename}</span>
          <button
            className="delete-btn"
            onClick={(e) => handleDelete(e, v.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
