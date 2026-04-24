# Frontend Standards

## Overview
Define scalable, maintainable, and performant frontend architecture for the Panchakarma Therapy Automation System.

## Architecture
- **Atomic Design Pattern**:
    - `atoms/`: Basic UI components (Button, Input, Badge, Card).
    - `molecules/`: Composite components (FormField, StatsCard).
    - `organisms/`: Complex feature-level components (PatientList, TherapyCalendar).
    - `templates/`: Page layouts.
- **Storybook Driven Development**: All atoms and molecules must have stories.
- **Module Aliases**: Use `@features`, `@components`, `@styles` for imports.

## Implementation

### State Management
- **Local**: `useState` for component-level state.
- **Global**: `Zustand` for application state (Auth, UI preferences).
- **Server**: `React Query` (@tanstack/react-query) for data fetching and caching.

### API Integration
- Centralized Axios client with interceptors for auth.
- Use custom hooks for all API interactions.
- All requests and responses must be typed.

### Styling
- **SCSS**: Use SCSS with the project's premium design system tokens.
- **Variables**: Always use `$variable-name` or CSS variables from `_variables.scss`.
- **Glassmorphism**: Use the `glass` utility for cards and surfaces.

### UI States
Components must handle:
- Loading (Skeleton or Spinner)
- Error (Alert or Inline message)
- Empty (Empty state illustration/text)
- Disabled

## Testing
- Component testing with **Vitest** and **Testing Library**.
- Storybook visual testing for UI consistency.

## Definition of Done
- [ ] UI implemented according to designs.
- [ ] Responsive for Mobile/Desktop.
- [ ] States handled (Loading, Error, Empty).
- [ ] Storybook stories created.
- [ ] Tests pass.
