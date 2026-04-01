# API Reference

Base URL: `http://localhost:8000/api`

Auto-generated Swagger docs: `http://localhost:8000/docs`

## Authentication

All endpoints except `/auth/login` and `/health` require a Bearer token:

```
Authorization: Bearer <jwt_token>
```

### POST /auth/login

Request: `{ "username": "email@example.com", "password": "..." }`

Response: `{ "token": "jwt...", "user": { "id", "name", "email", "role" } }`

## Patients

- `GET /patients/` - List all patients
- `GET /patients/:id` - Get patient by ID

## Therapies

- `GET /therapies/` - List therapy definitions with workflows
- `GET /therapies/:id` - Get single therapy

## Schedule

- `GET /schedule/` - List all sessions
- `POST /schedule/` - Create session (returns conflicts if detected)
- `PUT /schedule/:id` - Update session
- `DELETE /schedule/:id` - Delete session

## Documents

- `POST /documents/` - Upload document (multipart/form-data)
- `GET /documents/` - List documents
- `GET /documents/:id` - Get document with processing status
- `GET /documents/search?q=...` - Semantic search
- `DELETE /documents/:id` - Delete document

## Dashboard

- `GET /dashboard/kpis` - Key performance indicators
- `GET /dashboard/trends` - Session trends
- `GET /dashboard/availability` - Therapist/room status
- `GET /dashboard/alerts` - System alerts
- `GET /dashboard/notifications?role=` - Role-based notifications
