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
