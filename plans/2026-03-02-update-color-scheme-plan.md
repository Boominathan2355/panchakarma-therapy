# Update Dashboard Color Scheme

Update the global CSS variables to match the user's requested color palette for a refreshed look.

## Proposed Changes

### [Global Styles]

#### [MODIFY] [index.css](file:///home/bn/projects/panchakarma-therapy/src/index.css)
- Update `--background-color` to `#f3f5f2`.
- Update `--surface-color` to `#fefeff`.
- Update `--text-primary` to `#2e2c51`.

## Verification Plan

### Manual Verification
- View the dashboard at `http://localhost:5173/dashboard`.
- **Expected Results**:
    - The overall background should be a light sage/grey (`#f3f5f2`).
    - Cards and containers should be almost pure white (`#fefeff`).
    - Header and primary text should be a deep navy/purple (`#2e2c51`).
