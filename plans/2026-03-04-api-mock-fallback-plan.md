# Implementation Plan - API Mock Fallback

Implement a mock API fallback mechanism to ensure the application remains functional even when the backend API is unreachable or when mock mode is explicitly enabled.

## Goal Description
The objective is to handle API connections gracefully. If the application cannot connect to the backend (e.g., Network Error) or if a mock configuration flag is enabled, the API client should automatically return mock data instead of failing. This allows the frontend to be developed and demonstrated without a live backend.

## Proposed Changes

### Configuration
#### [MODIFY] [appConfig.js](file:///home/bn/projects/panchakarma-therapy/src/constants/appConfig.js)
- Add a `useMock` flag to `appConfig.api`, controlled by `import.meta.env.VITE_USE_MOCK` (default to false).

### API Client
#### [MODIFY] [api.js](file:///home/bn/projects/panchakarma-therapy/src/services/api.js)
- Implement an Axios request interceptor that checks `appConfig.api.useMock`. If true, it returns a simulated response and rejects the actual request via throwing an Error with `config.cancelToken` or a Custom Error, which the response interceptor catches to return mock data.
- Or simply implement an Axios response interceptor that catches Network Errors (`ERR_NETWORK`). If a network error occurs, it falls back to providing a mocked response globally.

### Mock Data Definitions
#### [NEW] [mockData.js](file:///home/bn/projects/panchakarma-therapy/src/services/mockData.js)
- Create a centralized file containing mock responses for endpoints that the services call (`/auth/login`, `/documents/`, `/therapists/`, `/schedule/`).

### Services Updates
#### [MODIFY] [authService.js](file:///home/bn/projects/panchakarma-therapy/src/services/authService.js)
- Refactor `authService.js` to rely on `api.post('/auth/login', credentials)` instead of its hardcoded `mockLogin` function, since the mock interceptor will now handle it if the API is down.

## Verification Plan

### Automated Tests
- Run `npm run lint` to ensure no syntax errors.

### Manual Verification
- Test login with random credentials when `useMock=true` to see if the mock interceptor intercepts it.
- Stop the backend server and ensure `api.js` correctly falls back to mock data.
