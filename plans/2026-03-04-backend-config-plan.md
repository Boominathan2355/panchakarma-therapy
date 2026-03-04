# Implementation Plan - Centralized Backend Configuration

Centralize backend connection settings to improve maintainability and follow structural discipline.

## Proposed Changes

### [Component Name] Constants

#### [NEW] [appConfig.js](file:///home/bn/projects/panchakarma-therapy/src/constants/appConfig.js)
Create a new file to store backend-related constants, sourcing them from environment variables via Vite's `import.meta.env`.

### [Component Name] Services

#### [MODIFY] [api.js](file:///home/bn/projects/panchakarma-therapy/src/services/api.js)
Refactor to import the base URL and other settings from `appConfig.js` instead of directly accessing `import.meta.env`.

## Verification Plan

### Automated Tests
- Run `npm run lint` to ensure no syntax errors.
- (If tests exist) Run `npm test`.

### Manual Verification
- Verify that the application still correctly points to the backend URL.
- Check the console for any configuration-related errors.
