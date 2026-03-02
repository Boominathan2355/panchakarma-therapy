# Create Common Table Component

Implement a reusable, premium-looking `Table` component to unify table structures across the application.

## Proposed Changes

### [New Component]

#### [NEW] [Table.jsx](file:///home/bn/projects/panchakarma-therapy/src/components/molecules/Table.jsx)
- Create a reusable `Table` component that accepts `columns` and `data`.
- Support loading states with skeletons.
- Support custom cell rendering.
- Support row click handlers.

#### [NEW] [Table.css](file:///home/bn/projects/panchakarma-therapy/src/components/molecules/Table.css)
- Implement premium styling for the table:
    - Subtle borders and shadows.
    - Hover effects for rows.
    - Responsive behavior.
    - Consistent typography and spacing.

### [Refactoring]

#### [MODIFY] [PatientList.jsx](file:///home/bn/projects/panchakarma-therapy/src/components/organisms/PatientList.jsx)
- Replace custom div-based table with the new `Table` component.

#### [MODIFY] [AvailabilityTable.jsx](file:///home/bn/projects/panchakarma-therapy/src/components/organisms/AvailabilityTable.jsx)
- Replace `<table>` with the new `Table` component.

#### [MODIFY] [AuditLogTable.jsx](file:///home/bn/projects/panchakarma-therapy/src/components/organisms/AuditLogTable.jsx)
- Replace `<table>` with the new `Table` component.

## Verification Plan

### Manual Verification
- Navigate to the dashboard, patients page, and audit logs.
- Verify that tables are displayed correctly and look consistent.
- Test loading states by simulating slow data fetch.
- Test empty states.
- Verify that row clicking still works as expected.
