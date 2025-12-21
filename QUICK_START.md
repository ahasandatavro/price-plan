# 🚀 Quick Start Guide

## Project Structure Overview

```
📁 price-plan/
│
├── 📁 src/
│   ├── 📁 components/          ← React UI Components
│   │   ├── 📁 BillingToggle/
│   │   ├── 📁 CalculatorForm/
│   │   ├── 📁 EnterprisePlanCard/
│   │   ├── 📁 PlanCard/
│   │   ├── 📁 PlansGrid/
│   │   ├── 📁 ResultsSummary/
│   │   └── 📄 index.ts         ← Component exports
│   │
│   ├── 📁 constants/           ← Configuration & Data
│   │   └── 📄 plans.ts         ← Pricing plans
│   │
│   ├── 📁 hooks/               ← Custom React Hooks
│   │   └── 📄 useStorageCalculator.ts
│   │
│   ├── 📁 types/               ← TypeScript Types
│   │   └── 📄 index.ts
│   │
│   ├── 📁 utils/               ← Business Logic
│   │   ├── 📄 planRecommendation.ts
│   │   └── 📄 storage.ts
│   │
│   ├── 📄 App.tsx              ← Main Component
│   ├── 📄 main.tsx             ← Entry Point
│   └── 📄 index.css            ← Global Styles
│
├── 📄 package.json
├── 📄 README.md
├── 📄 ARCHITECTURE.md          ← Detailed Architecture
└── 📄 vite.config.ts
```

## 🎯 Key Files & Their Purpose

### Components (`src/components/`)
Each component is in its own folder for better organization:

- **CalculatorForm** - User input form (films, duration, 4K%)
- **BillingToggle** - Switch between monthly/annual billing
- **ResultsSummary** - Display calculated storage & recommended plan
- **PlanCard** - Individual pricing plan card
- **EnterprisePlanCard** - Special card for enterprise plans
- **PlansGrid** - Grid layout for all plans

### Business Logic (`src/utils/`)

- **storage.ts** - Storage calculation functions
  - `calculateTotalStorage()` - Main calculation
  - `formatStorage()` - Format GB/TB display
  - `getEnterpriseTierRate()` - Enterprise pricing tiers

- **planRecommendation.ts** - Plan selection logic
  - `findRecommendedPlan()` - Find best plan for requirements

### State Management (`src/hooks/`)

- **useStorageCalculator.ts** - Main application hook
  - Manages all input state
  - Performs calculations
  - Returns results

### Configuration (`src/constants/`)

- **plans.ts** - All pricing plans and rates
  - Monthly plans
  - Annual plans
  - Storage rates (HD/4K)
  - Enterprise tier rates

### Types (`src/types/`)

- **index.ts** - TypeScript definitions
  - `Plan` - Standard plan structure
  - `EnterprisePlan` - Enterprise plan with extras
  - `CalculationResult` - Calculation output
  - `BillingCycle` - 'monthly' | 'annual'

## 🛠️ Common Tasks

### 1. Add a New Pricing Plan

Edit `src/constants/plans.ts`:

```typescript
export const PLANS: Plans = {
  monthly: {
    // Add your new plan here
    premium: {
      name: 'Premium',
      cost: 150,
      storage: 2000,
      users: 10,
      features: [
        '2 TB upload per year',
        'Up to 10 users',
        // ... more features
      ]
    }
  },
  annual: {
    // Add annual version
  }
};
```

### 2. Modify Storage Calculation

Edit `src/utils/storage.ts`:

```typescript
export const STORAGE_RATES = {
  HD_PER_MINUTE: 7 / 60,      // Adjust these values
  FOUR_K_PER_MINUTE: 16 / 60
};
```

### 3. Add a New Component

1. Create folder: `src/components/MyComponent/`
2. Create file: `MyComponent.tsx`
3. Export from: `src/components/index.ts`

```typescript
// MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  // Define props
}

export const MyComponent: React.FC<MyComponentProps> = (props) => {
  return <div>My Component</div>;
};
```

```typescript
// index.ts
export { MyComponent } from './MyComponent/MyComponent';
```

### 4. Update Calculation Logic

Edit `src/hooks/useStorageCalculator.ts`:

```typescript
const calculateStorage = (): CalculationResult | null => {
  // Modify calculation logic here
};
```

## 📊 Data Flow

```
1. User enters data in CalculatorForm
        ↓
2. useStorageCalculator hook receives input
        ↓
3. Hook calls utils/storage.ts functions
        ↓
4. Hook calls utils/planRecommendation.ts
        ↓
5. Results displayed in ResultsSummary
        ↓
6. PlansGrid shows all available plans
```

## 🎨 Styling

The project uses **Tailwind CSS 4**:

- Utility-first approach
- Responsive by default
- Custom gradient theme (purple/blue)

Common classes:
```typescript
// Buttons
className="bg-purple-600 text-white px-6 py-3 rounded-lg"

// Cards
className="bg-white rounded-xl shadow-xl p-6"

// Gradients
className="bg-gradient-to-r from-purple-600 to-blue-600"
```

## 🧪 Development Workflow

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## 📝 Code Conventions

### Naming
- **Components**: PascalCase (`CalculatorForm`)
- **Functions**: camelCase (`calculateStorage`)
- **Constants**: UPPER_SNAKE_CASE (`STORAGE_RATES`)
- **Types**: PascalCase (`BillingCycle`)

### File Organization
- One component per file
- Component name matches file name
- Types defined in `src/types/`
- Utils are pure functions

### Imports
```typescript
// React imports first
import React from 'react';

// Third-party imports
import { Calculator } from 'lucide-react';

// Local imports
import { useStorageCalculator } from './hooks/useStorageCalculator';
import { CalculatorForm } from './components';
import type { BillingCycle } from './types';
```

## 🐛 Debugging Tips

### Check Calculations
Add console.log in `useStorageCalculator`:
```typescript
useEffect(() => {
  const newResult = calculateStorage();
  console.log('Calculation result:', newResult);
  setResult(newResult);
}, [inputs.films, inputs.duration, inputs.fourKPercent, billingCycle]);
```

### Inspect Component Props
Use React DevTools to inspect component props and state.

### Type Errors
Check `src/types/index.ts` for type definitions.

## 📚 Additional Resources

- **README.md** - Project overview and setup
- **ARCHITECTURE.md** - Detailed architecture documentation
- **package.json** - Dependencies and scripts

## 🎓 Learning Path

1. Start with `src/App.tsx` - Main component
2. Explore `src/hooks/useStorageCalculator.ts` - State logic
3. Check `src/utils/` - Business logic
4. Review `src/components/` - UI components
5. Understand `src/constants/plans.ts` - Configuration

## 💡 Pro Tips

1. **Use TypeScript** - Types catch errors early
2. **Keep components small** - Single responsibility
3. **Extract reusable logic** - Create custom hooks
4. **Use constants** - Avoid magic numbers
5. **Document complex logic** - Add comments

## 🚀 Next Steps

1. Run `npm install` to install dependencies
2. Run `npm run dev` to start development
3. Open browser to `http://localhost:5173`
4. Start coding! 🎉

---

**Need help?** Check ARCHITECTURE.md for detailed documentation.


