# JavaScript → TypeScript Migration Plan
> **Project**: panchakarma-therapy  
> **Date**: 2026-04-01  
> **Status**: Draft  
> **Scope**: Full migration of all `.js` / `.jsx` files to `.ts` / `.tsx`

---

## 1. Codebase Audit

### Summary

| Category          | Count | Extensions      |
|-------------------|-------|-----------------|
| Root config files | 2     | `.js`           |
| Source `.js`      | 29    | `.js`           |
| Source `.jsx`     | 61    | `.jsx`          |
| **Total**         | **92** |               |

### Existing TypeScript Readiness

| Item | State |
|------|-------|
| `@types/react` | ✅ Already installed (`^19.2.5`) |
| `@types/react-dom` | ✅ Already installed (`^19.2.3`) |
| `typescript` package | ❌ Not installed |
| `tsconfig.json` | ❌ Missing |
| `@typescript-eslint/*` | ❌ Not installed |
| `prop-types` usage | ⚠️ Used — will be replaced by TS interfaces |
| `vite.config.js` | ⚠️ Needs rename to `.ts` |
| `eslint.config.js` | ⚠️ Needs TS parser config |

---

### Files by Module

#### `src/` root (2 files)
| File | Target |
|------|--------|
| `src/main.jsx` | `src/main.tsx` |
| `src/App.jsx` | `src/App.tsx` |

#### `src/constants/` (1 file)
| File | Target |
|------|--------|
| `constants/appConfig.js` | `constants/appConfig.ts` |

> Needs: exported `AppConfig` interface

#### `src/utils/` (1 file)
| File | Target |
|------|--------|
| `utils/storage.js` | `utils/storage.ts` |

> Needs: typed `get`, `set`, `remove`, `clear` signatures

#### `src/services/` (12 files)
| File | Target |
|------|--------|
| `api.js` | `api.ts` |
| `authService.js` | `authService.ts` |
| `patientService.js` | `patientService.ts` |
| `therapyService.js` | `therapyService.ts` |
| `therapyPlanService.js` | `therapyPlanService.ts` |
| `scheduleService.js` | `scheduleService.ts` |
| `resourceService.js` | `resourceService.ts` |
| `auditService.js` | `auditService.ts` |
| `dashboardService.js` | `dashboardService.ts` |
| `documentService.js` | `documentService.ts` |
| `therapistService.js` | `therapistService.ts` |
| `mockData.js` | `mockData.ts` |

> Needs: `AxiosResponse<T>` typed return types; shared domain `types/` interfaces (Patient, Therapy, Schedule, etc.)

#### `src/store/` (8 files)
| File | Target |
|------|--------|
| `store/index.js` | `store/index.ts` |
| `slices/authSlice.js` | `slices/authSlice.ts` |
| `slices/patientSlice.js` | `slices/patientSlice.ts` |
| `slices/scheduleSlice.js` | `slices/scheduleSlice.ts` |
| `slices/therapySlice.js` | `slices/therapySlice.ts` |
| `slices/therapyPlanSlice.js` | `slices/therapyPlanSlice.ts` |
| `slices/resourceSlice.js` | `slices/resourceSlice.ts` |
| `slices/auditSlice.js` | `slices/auditSlice.ts` |

> Needs: `RootState` and `AppDispatch` typed exports; `createAsyncThunk<Return, Arg, ThunkApiConfig>` generics; per-slice state interfaces.

#### `src/algorithms/` (7 files — highest complexity)
| File | Target |
|------|--------|
| `algorithms/index.js` | `algorithms/index.ts` |
| `algorithms/hybridScheduler.js` | `algorithms/hybridScheduler.ts` |
| `algorithms/geneticAlgorithm.js` | `algorithms/geneticAlgorithm.ts` |
| `algorithms/particleSwarmOptimization.js` | `algorithms/particleSwarmOptimization.ts` |
| `algorithms/priorityHeuristics.js` | `algorithms/priorityHeuristics.ts` |
| `algorithms/ruleBasedConstraints.js` | `algorithms/ruleBasedConstraints.ts` |
| `algorithms/explainability.js` | `algorithms/explainability.ts` |

> Needs: Complex domain-specific types (scheduling, resources, constraints, fitness functions). Consider a dedicated `src/types/algorithms.ts`.

#### `src/routes/` (2 files)
| File | Target |
|------|--------|
| `AppRoutes.jsx` | `AppRoutes.tsx` |
| `PrivateRoute.jsx` | `PrivateRoute.tsx` |

#### `src/components/` (50 files)
Breaking down by atomic layer:

| Layer | File Count | Notes |
|-------|-----------|-------|
| `atoms/` | 8 | Simple props — easiest to type |
| `molecules/` | 9 | Medium complexity |
| `organisms/` | 29 | Highest complexity — chart components, modals |
| `templates/` | 2 | Layout wrappers |

> All `.jsx` → `.tsx`. Replace `prop-types` with TS interfaces for each component's props.

#### `src/pages/` (8 directories, ~15+ JSX files)
| Directory |
|-----------|
| `pages/audit/` |
| `pages/auth/` |
| `pages/dashboard/` |
| `pages/patients/` |
| `pages/resources/` |
| `pages/schedule/` |
| `pages/settings/` |
| `pages/therapy/` |

> All page components `.jsx` → `.tsx`

#### Root config files (2 files)
| File | Target |
|------|--------|
| `vite.config.js` | `vite.config.ts` |
| `eslint.config.js` | `eslint.config.js` (update parser/plugins, keep as `.js`) |

---

## 2. Migration Strategy

### Approach: Incremental (Module-by-Module)

Use the **"strict": false → true"** progressive tightening strategy:
1. Start with `"strict": false` — get the project compiling without errors
2. Tighten to `"strict": true` module by module
3. Replace all `any` types with proper types before merging

### Phase Order

```
Phase 1: Infrastructure (1 day)
  └─ Install TypeScript & tooling
  └─ Add tsconfig.json
  └─ Update vite.config → .ts
  └─ Update eslint.config.js for TS

Phase 2: Shared Types (1–2 days)
  └─ Create src/types/ directory
  └─ Define domain models (Patient, Therapy, Schedule, Resource, etc.)
  └─ Define API response shapes

Phase 3: Foundation Layer (1–2 days)
  └─ utils/ (storage.ts)
  └─ constants/ (appConfig.ts)
  └─ services/ (api.ts + all service files)

Phase 4: State Layer (1–2 days)
  └─ store/index.ts → export RootState, AppDispatch
  └─ All store/slices/*.ts

Phase 5: Algorithm Layer (2–3 days)
  └─ src/algorithms/*.ts
  └─ This is the most complex — proceed carefully

Phase 6: Components Layer (3–5 days)
  └─ atoms/ → molecules/ → organisms/ → templates/
  └─ Replace prop-types with TS interfaces

Phase 7: Pages & Routes (1–2 days)
  └─ src/routes/*.tsx
  └─ src/pages/**/*.tsx

Phase 8: Cleanup & Strict Mode (1–2 days)
  └─ Enable "strict": true
  └─ Eliminate remaining `any` types
  └─ Remove prop-types dependency
```

**Estimated Total: ~12–18 development days**

---

## 3. New Files & Infrastructure to Create

### `tsconfig.json` (project root)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": false,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### `tsconfig.node.json` (project root)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

### `src/types/` — New Directory Structure
```
src/types/
  index.ts          ← re-export barrel
  patient.ts        ← Patient, MedicalRecord, Document interfaces
  therapy.ts        ← TherapyPlan, Session, TherapyType interfaces
  schedule.ts       ← Schedule, TimeSlot, Conflict interfaces
  resource.ts       ← Resource, Availability interfaces
  auth.ts           ← User, AuthState, LoginCredentials interfaces
  audit.ts          ← AuditLog, AuditEntry interfaces
  algorithms.ts     ← ScheduleInput, Chromosome, Particle, etc.
  api.ts            ← ApiResponse<T>, PaginatedResponse<T>
```

### Packages to Install
```bash
npm install -D typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin
```
> Note: `@types/react` and `@types/react-dom` are **already installed**.  
> Also check if `@types/react-big-calendar` and `@types/date-fns` are needed.

---

## 4. Key Typing Patterns

### Redux Store (store/index.ts)
```typescript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks (src/store/hooks.ts)
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Async Thunks (authSlice.ts example)
```typescript
interface LoginCredentials { email: string; password: string; }
interface AuthResponse { user: User; token: string; }

export const login = createAsyncThunk<AuthResponse, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, thunkAPI) => { ... }
);
```

### Component Props (replace prop-types)
```typescript
// Before (JS)
Button.propTypes = { label: PropTypes.string.isRequired };

// After (TS)
interface ButtonProps { label: string; onClick?: () => void; }
const Button: React.FC<ButtonProps> = ({ label, onClick }) => ...
```

### Axios Service Response
```typescript
import api from './api';
import type { ApiResponse, Patient } from '../types';

async function getPatients(): Promise<Patient[]> {
  const { data } = await api.get<ApiResponse<Patient[]>>('/patients');
  return data.data;
}
```

---

## 5. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Algorithm files have complex implicit types | High | Start with `any`, progressively refine |
| `react-big-calendar` may lack TS types | Medium | Check `@types/react-big-calendar` or use `declare module` |
| `echarts-for-react` TS support | Medium | Wrap in typed component facade |
| Mock data shapes diverge from real API | High | Create `ApiResponse<T>` generic to enforce consistency |
| Breaking changes during rename | Low | Use git branches per phase; run `vite build` after each phase |

---

## 6. Definition of Done

- [ ] All source files have `.ts` / `.tsx` extensions
- [ ] `tsc --noEmit` exits with 0 errors
- [ ] `vite build` succeeds
- [ ] `eslint .` passes with TS rules enabled
- [ ] Zero `any` types (or all explicitly justified with `// eslint-disable`)
- [ ] `prop-types` dependency removed from `package.json`
- [ ] `src/types/` fully populated with domain interfaces
- [ ] `useAppSelector` / `useAppDispatch` hooks used throughout
- [ ] All algorithm files have proper typed signatures

---

## 7. Branch Strategy

```
main
 └─ feat/ts-migration
      ├─ feat/ts-migration-phase-1-infra
      ├─ feat/ts-migration-phase-2-types
      ├─ feat/ts-migration-phase-3-services
      ├─ feat/ts-migration-phase-4-store
      ├─ feat/ts-migration-phase-5-algorithms
      ├─ feat/ts-migration-phase-6-components
      └─ feat/ts-migration-phase-7-pages
```

Merge each phase branch into `feat/ts-migration` after verification, then merge to `main` when all phases complete.

---

*Generated by Antigravity on 2026-04-01*
