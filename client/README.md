# PTAS Client

React frontend for the Panchakarma Therapy Automation System.

## Setup

```bash
npm install
npm run dev       # Start dev server on :5173
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build to dist/ |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |
| `npm run preview` | Preview production build |

## Architecture

Uses **Atomic Design** pattern:
- `atoms/` - Basic UI (Button, Input, Card)
- `molecules/` - Composite (FormField, StatsCard)
- `organisms/` - Complex (PatientList, TherapyCalendar, ScheduleOptimizer)
- `templates/` - Layouts (MainLayout, AuthLayout)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `/api` (proxied in dev) |
| `VITE_USE_MOCK` | Enable mock mode | `false` |
