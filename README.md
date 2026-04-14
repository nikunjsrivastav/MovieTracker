# MovieTracker

MovieTracker is a full-stack movie app with:

- `frontend/`: React + Vite client
- `backend/`: Express API with JWT auth and SQLite user storage

The frontend uses TMDB for movie data and the backend for user accounts, login, profile management, and account settings.

## Tech Stack

- Frontend: React, Vite, React Router
- Backend: Node.js, Express
- Auth: JWT bearer tokens
- Password hashing: Argon2id
- Database: SQLite

## Project Structure

```text
MovieTracker/
  frontend/
  backend/
  docs/
```

## Requirements

- Node.js 18+ recommended
- npm
- A TMDB API key for movie browsing

## Run Both Apps

You will run the backend and frontend in separate terminals.

### 1. Clone and enter the repo

```bash
git clone https://github.com/nikunjsrivastav/MovieTracker.git
cd MovieTracker
```

### 2. Set up the backend

Open a terminal in `backend/`:

```bash
cd backend
npm install
```

Create `backend/.env` from `backend/.env.example`:

```env
PORT=4000
DATABASE_URL="./data/movietracker.db"
JWT_SECRET="replace-with-a-long-random-secret-at-least-32-characters"
JWT_EXPIRES_IN="1d"
CORS_ORIGIN="http://localhost:5173"
```

Important:

- Use a real random secret for `JWT_SECRET`
- Keep `CORS_ORIGIN` aligned with your frontend dev URL

Initialize the local database:

```bash
npm run db:init
```

Start the backend:

```bash
npm run dev
```

The API will run at:

```text
http://localhost:4000
```

### 3. Set up the frontend

Open a second terminal in `frontend/`:

```bash
cd frontend
npm install
```

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_TMDB_API_KEY=your_actual_tmdb_key_here
VITE_API_BASE_URL=http://localhost:4000/api
```

Start the frontend:

```bash
npm run dev
```

The app will run at:

```text
http://localhost:5173
```

## Local Development Flow

1. Start the backend in `backend/`
2. Start the frontend in `frontend/`
3. Open `http://localhost:5173`
4. Use the header `Login` button to register or sign in

The frontend stores the JWT in browser `localStorage` and sends it as a bearer token to the backend.

## Environment Variables

### Backend

- `PORT`: API port
- `DATABASE_URL`: SQLite database path
- `JWT_SECRET`: signing secret for JWTs
- `JWT_EXPIRES_IN`: token lifetime
- `CORS_ORIGIN`: allowed frontend origin

### Frontend

- `VITE_TMDB_API_KEY`: TMDB API key
- `VITE_API_BASE_URL`: backend API base URL, default `http://localhost:4000/api`

## Available Scripts

### Backend

```bash
npm run dev
npm run start
npm run db:init
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

## Main Features

- Movie browsing with TMDB
- Search and discovery UI
- Registration and login
- JWT-based authentication
- Current-user profile view/edit
- Change password
- Delete account

## Auth API Summary

Backend routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `PATCH /api/users/me`
- `DELETE /api/users/me`

Protected routes require:

```http
Authorization: Bearer <token>
```

## Troubleshooting

### Frontend cannot talk to backend

Check:

- backend is running on `http://localhost:4000`
- `frontend/.env` has `VITE_API_BASE_URL=http://localhost:4000/api`
- backend `CORS_ORIGIN` matches `http://localhost:5173`

### Login/register works poorly or fails

Check:

- `JWT_SECRET` is set in `backend/.env`
- backend was restarted after changing env values
- database was initialized with `npm run db:init`

### Movies do not load

Check:

- `VITE_TMDB_API_KEY` is set correctly
- the TMDB key is valid

## Additional Docs

- Backend details: [backend/README.md](/d:/Engineering/Projects/MovieTracker/backend/README.md)
