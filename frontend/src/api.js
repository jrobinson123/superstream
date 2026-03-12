export async function getVideos() {
  const res = await fetch("/videos");
  return res.json();
}

export async function uploadVideo(title, file) {
  const form = new FormData();
  form.append("title", title);
  form.append("file", file);
  const res = await fetch("/upload", { method: "POST", body: form });
  return res.json();
}

export async function deleteVideo(id) {
  await fetch(`/videos/${id}`, { method: "DELETE" });
}

export function streamUrl(id) {
  return `/videos/${id}/stream`;
}
