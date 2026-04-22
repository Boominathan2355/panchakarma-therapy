# Authentication Flow

## Overview
Secure username-based authentication system providing role-based access control and session persistence.

## Architecture
- Feature-based structure: `src/features/auth`
- Redux State Management: `authSlice`
- API Service: `authService` using `axios`
- Storage: `localStorage` for JWT and user data

## Implementation
### Components
- `LoginForm`: Redesigned modern SaaS login interface with validation and loading states.
- `AuthLayout`: Centered card layout with responsive background.

### Store
- `login`: Async thunk for authentication.
- `logout`: Clears session and local storage.
- `reset`: Resets UI states (loading, error, success).

## Usage
Import components from the feature barrel:
```tsx
import { LoginPage } from '../features/auth';
```

## UI States
- Default: Clean login card with username and password fields.
- Loading: Submit button shows spinner and "Signing In..." text.
- Error: Animated banner displaying error message.
- Success: Redirects to `/dashboard`.

## Accessibility
- ARIA labels for all inputs.
- `role="alert"` for error messages.
- `aria-required` and `aria-labelledby` attributes.

## Testing
- Unit tests: `LoginForm.test.tsx` using Vitest + React Testing Library.
- Storybook: `LoginForm.stories.tsx` for visual regression.
- Coverage target: ≥95% for auth logic.

## Notes
- Session is persisted in `localStorage`.
- All API calls are proxied through Vite in development.
