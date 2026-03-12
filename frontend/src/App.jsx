import { useState } from "react";
import VideoList from "./VideoList";
import UploadForm from "./UploadForm";
import Player from "./Player";
import "./App.css";

export default function App() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="app">
      <header>
        <h1>SuperStream</h1>
      </header>
      <main>
        <UploadForm onUploaded={() => setRefresh((r) => r + 1)} />
        <section className="library">
          <h2>Library</h2>
          <VideoList onSelect={setSelectedVideo} refresh={refresh} />
        </section>
      </main>
      <Player video={selectedVideo} onClose={() => setSelectedVideo(null)} />
    </div>
  );
}
