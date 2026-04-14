# Backend API

The backend is an Express API with JWT auth, Argon2 password hashing, Zod request validation, and a local SQLite database.

## Environment Variables

Copy `.env.example` to `.env` and set:

- `PORT`: API port, default `4000`
- `DATABASE_URL`: SQLite file path, default `./data/movietracker.db`
- `JWT_SECRET`: long random secret used to sign access tokens
- `JWT_EXPIRES_IN`: token lifetime, default `1d`
- `CORS_ORIGIN`: allowed frontend origin, default `http://localhost:5173`

## Running It

```bash
npm install
npm run db:init
npm run dev
```

## Routes

### `POST /api/auth/register`

Creates a user account.

Request body:

```json
{
  "name": "Movie Fan",
  "email": "user@example.com",
  "password": "Password123"
}
```

Success response: `201 Created`

Duplicate email response: `409 Conflict`

### `POST /api/auth/login`

Authenticates an existing user and returns a signed JWT.

Success response: `200 OK`

```json
{
  "token": "jwt-here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "createdAt": "2026-04-14T11:35:14.000Z",
    "updatedAt": "2026-04-14T11:35:14.000Z"
  }
}
```

Invalid credentials response: `401 Unauthorized`

### `GET /api/users/me`

Returns the authenticated user's profile.

### `PATCH /api/users/me`

Updates the authenticated user's email and/or password.

Request body:

```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "currentPassword": "Password123",
  "password": "NewPassword123"
}
```

### `DELETE /api/users/me`

Deletes the authenticated user's account.

## Architecture

- `src/routes/`: route definitions
- `src/controllers/`: HTTP handlers
- `src/services/`: business logic
- `src/repositories/`: database access
- `src/models/`: response mapping helpers
- `src/middleware/`: auth, validation, and error handling
- `src/db/schema.sql`: database schema

## Security Notes

- Passwords are hashed with Argon2id before storage.
- JWTs are signed and validated with issuer and audience checks.
- Protected routes attach the authenticated user to the request before handlers run.
- Auth routes have a basic rate limiter to reduce brute-force attempts.
- Request bodies are validated with Zod before business logic runs.
- Password hashes are never returned in API responses.

## Recommended Next Steps For Production

- Move from SQLite to PostgreSQL before deploying to a real multi-user environment.
- Add refresh tokens or short-lived access tokens plus token rotation.
- Add email verification and password reset flows.
- Add audit logging around account changes and deletions.
- Add stronger rate limiting and monitoring at the edge or reverse proxy layer.
