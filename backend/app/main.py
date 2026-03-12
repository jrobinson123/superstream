
from fastapi import FastAPI, UploadFile, File, Form, Request, HTTPException
from fastapi.responses import StreamingResponse
from app.database import engine, Base, SessionLocal
from app.models.video import Video
import shutil
import os

app = FastAPI(title="SuperStream")

Base.metadata.create_all(bind=engine)

@app.get("/help")
def help():
    try:
        with engine.connect() as conn:
            return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "ok", "database": str(e)}
    
@app.post("/upload")
def upload(title: str = Form(...), file: UploadFile = File(...)):
    file_path = f"uploads/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    db = SessionLocal()
    video = Video(title = title, file_path = file_path, filename = file.filename)
    db.add(video)
    db.commit()
    db.refresh(video)
    db.close()
    return {"id": video.id, "title": video.title, "filename": video.filename}
    

@app.get("/videos")
def get_videos():
    db = SessionLocal()
    videos = db.query(Video).all()
    db.close()
    return videos

@app.delete("/videos/{id}")
def delete_video(id: int):
    db = SessionLocal()
    video = db.query(Video).filter(Video.id == id).first()
    if not video:
        db.close()
        return {"error": "Video not found"}
    
    shared = db.query(Video).filter(Video.file_path == video.file_path).count()
    if shared == 1 and os.path.exists(video.file_path):
        os.remove(video.file_path)
    db.delete(video)
    db.commit()
    db.close()


@app.get("/videos/{id}/stream")
def stream_video(id: int, request: Request):
    db = SessionLocal()
    video = db.query(Video).filter(Video.id == id).first()
    db.close()

    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    file_path = video.file_path
    file_size = os.path.getsize(file_path)

    range_header = request.headers.get("Range")

    def iter_file(path, start, end):
        with open(path, "rb") as f:
            f.seek(start)
            remaining = end - start + 1
            chunk_size = 1024 * 1024  # 1MB
            while remaining > 0:
                data = f.read(min(chunk_size, remaining))
                if not data:
                    break
                remaining -= len(data)
                yield data

    if range_header:
        # Parse "bytes=start-end"
        range_val = range_header.replace("bytes=", "")
        parts = range_val.split("-")
        start = int(parts[0])
        end = int(parts[1]) if parts[1] else file_size - 1
        end = min(end, file_size - 1)

        headers = {
            "Content-Range": f"bytes {start}-{end}/{file_size}",
            "Accept-Ranges": "bytes",
            "Content-Length": str(end - start + 1),
            "Content-Type": "video/mp4",
        }
        return StreamingResponse(
            iter_file(file_path, start, end),
            status_code=206,
            headers=headers,
        )

    headers = {
        "Accept-Ranges": "bytes",
        "Content-Length": str(file_size),
        "Content-Type": "video/mp4",
    }
    return StreamingResponse(
        iter_file(file_path, 0, file_size - 1),
        status_code=200,
        headers=headers,
    )