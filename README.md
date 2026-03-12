# SuperStream

This is a relatively simple self-hosted video streaming app built to explore how frontend and backend systems and databases connect. It covers REST API design, database-backed persistence, file handling, and browser-native video streaming.

## What This Project Explores

### File Handling
Uploaded videos are written to disk (`backend/uploads/`) not a database. The database stores metadata and the file path about each filepath not the file itself. This separation means the database stays lightweight while the filesystem handles binary storage.


### Frontend ↔ Backend Communication

The frontend is in React and provides the dialog for uploading videos and for watching them. React frontend talks to the FastAPI backend exclusively through a REST API. 


Each fundamental action: retrieving all videos, uploading a video, deleting one, streaming a particular video — is a distinct HTTP request to a defined endpoint. The frontend has no direct knowledge of the database or filesystem; it only knows the API contract.


### REST API Design with FastAPI
The backend exposes a small, modular API built with FastAPI:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/help` | Health check — also verifies database connectivity |
| `GET` | `/videos` | List all videos |
| `POST` | `/upload` | Upload a video (multipart: `title`, `file`) |
| `DELETE` | `/videos/{id}` | Delete a video |
| `GET` | `/videos/{id}/stream` | Stream a video (supports HTTP Range requests) |


### Database Integration with SQLAlchemy
Video metadata is persisted in PostgreSQL via SQLAlchemy's ORM. The `Video` model maps directly to a database table:

```python
class Video(Base):
    id        = Column(Integer, primary_key=True)
    title     = Column(String)
    filename  = Column(String)
    file_path = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
```

The database connection string is loaded from a `.env` file using `python-dotenv`, keeping credentials out of source code. Tables are created automatically on startup. 


On delete, the backend checks whether multiple records share the same file path before removing the file from disk, preventing accidental data loss. For instance if multiple vidoes with the same filepath are uploaded, deleting one won't affect the others. 

### HTTP Range Requests and Video Streaming
Streaming is handled natively by the browser's `<video>` element and the HTTP Range request protocol — no streaming libraries required. When a video loads (or when a user seeks), the browser sends a `Range: bytes=start-end` header. The backend:

1. Parses the byte range from the header
2. Opens the file and seeks directly to the start offset
3. Streams the requested chunk back as a `206 Partial Content` response

This is what makes seeking work without downloading the entire file. Chunks are served at 1MB at a time using FastAPI's `StreamingResponse`, keeping memory usage flat regardless of file size.


## Setup

### 1. Database

Install and start PostgreSQL, then create the database:

```sql
CREATE DATABASE superstream;
```

The `videos` table will be created automatically when the backend starts.

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/superstream
```

Replace `YOUR_USER` and `YOUR_PASSWORD` with your PostgreSQL credentials.

Create the uploads directory:

```bash
mkdir uploads
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).
