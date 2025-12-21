# 🏗️ Project Architecture

## Overview

This document describes the architecture and organization of the Video Storage Plan Calculator application. The project follows modern React best practices with a clear separation of concerns.

## Folder Structure

```
src/
├── components/              # React UI Components
│   ├── BillingToggle/       # Billing cycle toggle component
│   │   └── BillingToggle.tsx
│   ├── CalculatorForm/      # Input form component
│   │   └── CalculatorForm.tsx
│   ├── EnterprisePlanCard/  # Enterprise plan card component
│   │   └── EnterprisePlanCard.tsx
│   ├── PlanCard/            # Standard plan card component
│   │   └── PlanCard.tsx
│   ├── PlansGrid/           # Plans grid layout component
│   │   └── PlansGrid.tsx
│   ├── ResultsSummary/      # Results summary component
│   │   └── ResultsSummary.tsx
│   └── index.ts             # Barrel export for components
│
├── constants/               # Application Constants
│   └── plans.ts             # Pricing plans and storage rates
│
├── hooks/                   # Custom React Hooks
│   └── useStorageCalculator.ts  # Storage calculation hook
│
├── types/                   # TypeScript Type Definitions
│   └── index.ts             # All application types
│
├── utils/                   # Utility Functions
│   ├── planRecommendation.ts    # Plan recommendation logic
│   └── storage.ts               # Storage calculation utilities
│
├── assets/                  # Static Assets
│   └── react.svg
│
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
└── index.css                # Global styles (Tailwind imports)
```

## Architecture Principles

### 1. Component-Based Architecture
Each UI element is broken down into small, reusable components with single responsibilities:
- **CalculatorForm**: Handles user input
- **BillingToggle**: Manages billing cycle selection
- **ResultsSummary**: Displays calculation results
- **PlanCard**: Renders individual plan details
- **EnterprisePlanCard**: Specialized card for enterprise plans
- **PlansGrid**: Organizes all plans in a grid layout

### 2. Separation of Concerns

#### Components (UI Layer)
- Pure presentational components
- Receive data via props
- Emit events via callbacks
- No business logic

#### Hooks (State Management)
- `useStorageCalculator`: Manages application state and orchestrates calculations
- Encapsulates complex state logic
- Provides clean API to components

#### Utils (Business Logic)
- `storage.ts`: Pure functions for storage calculations
- `planRecommendation.ts`: Logic for finding optimal plans
- No side effects
- Easily testable

#### Constants (Configuration)
- `plans.ts`: All pricing plans and rates
- Single source of truth for configuration
- Easy to update and maintain

#### Types (Type Safety)
- Comprehensive TypeScript definitions
- Ensures type safety across the application
- Self-documenting code

### 3. Data Flow

```
User Input (CalculatorForm)
    ↓
State Management (useStorageCalculator)
    ↓
Business Logic (utils/storage, utils/planRecommendation)
    ↓
Constants (constants/plans)
    ↓
Results (ResultsSummary, PlansGrid)
```

## Key Design Patterns

### 1. Custom Hooks Pattern
The `useStorageCalculator` hook encapsulates all calculation logic:
- Manages input state
- Handles billing cycle
- Performs calculations
- Returns computed results

**Benefits:**
- Reusable logic
- Cleaner components
- Easier testing
- Better separation of concerns

### 2. Barrel Exports
Components are exported through `index.ts`:
```typescript
export { CalculatorForm } from './CalculatorForm/CalculatorForm';
export { BillingToggle } from './BillingToggle/BillingToggle';
// ... more exports
```

**Benefits:**
- Cleaner imports
- Better organization
- Easier refactoring

### 3. Type-Safe Props
All components use TypeScript interfaces:
```typescript
interface CalculatorFormProps {
  inputs: StorageInputs;
  onInputChange: (field: keyof StorageInputs, value: string) => void;
}
```

**Benefits:**
- Compile-time safety
- Better IDE support
- Self-documenting code

### 4. Pure Functions
Utility functions are pure and side-effect free:
```typescript
export const calculateTotalStorage = (
  films: number,
  duration: number,
  fourKPercent: number
): { total: number; hd: number; fourK: number } => {
  // Pure calculation logic
};
```

**Benefits:**
- Predictable behavior
- Easy to test
- No hidden dependencies

## Component Hierarchy

```
App
├── CalculatorForm
│   └── Input fields (films, duration, 4K%)
├── BillingToggle
│   └── Monthly/Annual buttons
├── ResultsSummary
│   ├── Storage breakdown
│   └── Recommended plan
└── PlansGrid
    ├── PlanCard (multiple instances)
    └── EnterprisePlanCard (conditional)
```

## State Management

### Local State (useState)
- `showAllPlans`: Controls visibility of plans grid

### Custom Hook State (useStorageCalculator)
- `inputs`: User input values
- `billingCycle`: Selected billing cycle
- `result`: Calculated results

### Derived State
- `recommendedPlan`: Computed from inputs
- `allPlans`: Filtered based on billing cycle

## Type System

### Core Types
- `BillingCycle`: 'monthly' | 'annual'
- `Plan`: Standard plan structure
- `EnterprisePlan`: Extended plan with custom pricing
- `CalculationResult`: Complete calculation output
- `StorageInputs`: User input structure

### Type Safety Benefits
- Prevents runtime errors
- Enables refactoring with confidence
- Improves code documentation
- Better IDE autocomplete

## Styling Strategy

### Tailwind CSS
- Utility-first approach
- Responsive design
- Consistent spacing and colors
- Custom gradient backgrounds

### Design Tokens
- Purple/Blue gradient theme
- Consistent border radius
- Shadow hierarchy
- Responsive breakpoints

## Performance Considerations

### React.memo (Future Enhancement)
Components can be memoized to prevent unnecessary re-renders:
```typescript
export const PlanCard = React.memo<PlanCardProps>(({ ... }) => {
  // Component logic
});
```

### useCallback (Future Enhancement)
Event handlers can be memoized:
```typescript
const handleInputChange = useCallback((field, value) => {
  updateInput(field, value);
}, [updateInput]);
```

### useMemo (Current)
Calculations are memoized via `useEffect` dependency array

## Testing Strategy (Recommended)

### Unit Tests
- Utility functions (`storage.ts`, `planRecommendation.ts`)
- Pure calculation logic
- Type guards and validators

### Component Tests
- Render tests
- User interaction tests
- Props validation

### Integration Tests
- Full user flow
- Calculation accuracy
- Plan recommendations

## Future Enhancements

### Potential Improvements
1. **State Management**: Consider Zustand or Redux for complex state
2. **Form Validation**: Add input validation with Zod or Yup
3. **Animations**: Add Framer Motion for smooth transitions
4. **Internationalization**: Add i18n support
5. **Analytics**: Track user interactions
6. **API Integration**: Connect to backend for dynamic pricing
7. **Theming**: Add dark mode support
8. **Accessibility**: Enhanced ARIA labels and keyboard navigation

### Code Quality
1. **Unit Tests**: Add Jest + React Testing Library
2. **E2E Tests**: Add Playwright or Cypress
3. **Storybook**: Component documentation
4. **Husky**: Pre-commit hooks
5. **Prettier**: Code formatting

## Maintenance Guidelines

### Adding New Plans
1. Update `src/constants/plans.ts`
2. Ensure type compatibility
3. Test calculations

### Modifying Calculations
1. Update utility functions in `src/utils/`
2. Update types if needed
3. Test edge cases

### Adding Components
1. Create component folder in `src/components/`
2. Add TypeScript interface for props
3. Export from `src/components/index.ts`
4. Document component purpose

### Updating Styles
1. Use Tailwind utility classes
2. Maintain consistent design tokens
3. Ensure responsive behavior

## Conclusion

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Type safety throughout
- ✅ Maintainable and scalable code
- ✅ Easy to test and debug
- ✅ Professional code organization
- ✅ Excellent developer experience

The structure supports growth and makes it easy for new developers to understand and contribute to the codebase.

