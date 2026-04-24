# Backend Standards

## Overview
Define consistent, secure, and scalable backend systems for the Panchakarma Therapy Automation System using FastAPI.

## Architecture
- **Layered Architecture**:
    - **Routes**: API endpoints and input validation.
    - **Services**: Business logic and orchestration.
    - **Models**: SQLAlchemy database models.
    - **Schemas**: Pydantic models for request/response validation.
- **Dependency Injection**: Use FastAPI `Depends` for services and database sessions.

## Implementation

### API Design
- **RESTful**: standard HTTP methods (GET, POST, PUT, DELETE).
- **Versioning**: Prefix all routes with `/api/v1`.
- **Naming**: Use kebab-case for URL segments and plural nouns for resources.

### Request/Response
- Use **Pydantic** for all data validation and serialization.
- Standard response format: `{ "data": {...}, "meta": {...} }`.
- Consistent error handling returning appropriate HTTP status codes.

### Database
- **SQLAlchemy**: Use the Async session for all database operations.
- **Alembic**: (If applicable) for database migrations.
- **Transactions**: Ensure atomic operations for complex logic.

### Authentication
- **JWT**: Bearer token authentication.
- **Secure Cookies**: Refresh tokens stored in HttpOnly cookies.
- **RBAC**: Role-based access control for administrative actions.

## Definition of Done
- [ ] API endpoint implemented.
- [ ] Pydantic schemas defined for Request/Response.
- [ ] Unit tests for business logic.
- [ ] Integration tests for endpoints.
- [ ] OpenAPI (Swagger) documentation validated.
- [ ] Performance within acceptable limits (<300ms p95).

## Security
- Input sanitization.
- CORS configuration for the frontend.
- No sensitive data exposed in response bodies.
