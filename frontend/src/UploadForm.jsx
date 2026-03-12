import { useState } from "react";
import { uploadVideo } from "./api";

export default function UploadForm({ onUploaded }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !file) return;
    setLoading(true);
    setError(null);
    try {
      await uploadVideo(title, file);
      setTitle("");
      setFile(null);
      e.target.reset();
      onUploaded();
    } catch {
      setError("Upload failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <h2>Upload Video</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
