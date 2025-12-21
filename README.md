# 🎬 Video Storage Plan Calculator

A professional, modern web application for calculating video storage requirements and recommending optimal pricing plans. Built with React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Smart Storage Calculator**: Calculate storage needs based on number of films, duration, and video quality (HD/4K)
- **Dynamic Plan Recommendations**: Automatically recommends the best plan based on your requirements
- **Flexible Billing Options**: Toggle between monthly and annual billing cycles
- **Enterprise Pricing**: Automatic calculation for custom enterprise plans when standard plans don't suffice
- **Beautiful UI**: Modern, responsive design with gradient backgrounds and smooth animations
- **Type-Safe**: Built with TypeScript for enhanced code quality and developer experience

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── BillingToggle/   # Billing cycle selector
│   ├── CalculatorForm/  # Input form for storage calculation
│   ├── EnterprisePlanCard/  # Enterprise plan display
│   ├── PlanCard/        # Individual plan card
│   ├── PlansGrid/       # Grid layout for all plans
│   ├── ResultsSummary/  # Calculation results display
│   └── index.ts         # Component exports
├── constants/           # Application constants
│   └── plans.ts         # Pricing plans and storage rates
├── hooks/               # Custom React hooks
│   └── useStorageCalculator.ts  # Storage calculation logic
├── types/               # TypeScript type definitions
│   └── index.ts         # Application types
├── utils/               # Utility functions
│   ├── planRecommendation.ts  # Plan recommendation logic
│   └── storage.ts       # Storage calculation utilities
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd price-plan
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🛠️ Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **ESLint** - Code linting

## 📊 Pricing Plans

### Monthly Plans
- **Free**: 10 GB, 1 user
- **Growth**: 100 GB, 1 user - $44/month
- **Pro**: 600 GB, 2 users - $61/month
- **Business**: 1.2 TB, 5 users - $111/month

### Annual Plans (Save up to 15%)
- **Free**: 10 GB, 1 user
- **Starter**: 50 GB, 1 user - $21/month
- **Growth**: 100 GB, 1 user - $37/month
- **Pro**: 600 GB, 2 users - $51/month
- **Business**: 1.2 TB, 5 users - $94/month

### Enterprise
Custom storage and pricing for large-scale requirements with tiered rates.

## 🎨 Design Principles

- **Component-Based Architecture**: Modular, reusable components
- **Separation of Concerns**: Clear separation between UI, logic, and data
- **Type Safety**: Comprehensive TypeScript types throughout
- **Clean Code**: Well-documented, maintainable code
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🔧 Customization

### Adding New Plans

Edit `src/constants/plans.ts` to add or modify pricing plans:

```typescript
export const PLANS: Plans = {
  monthly: {
    // Add your plan here
  },
  annual: {
    // Add your plan here
  }
};
```

### Adjusting Storage Rates

Modify storage calculation rates in `src/constants/plans.ts`:

```typescript
export const STORAGE_RATES = {
  HD_PER_MINUTE: 7 / 60,
  FOUR_K_PER_MINUTE: 16 / 60
};
```

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

Contributions are welcome! Please follow the existing code structure and conventions.

## 📧 Contact

For questions or support, please contact the development team.

---

Built with ❤️ using React and TypeScript
