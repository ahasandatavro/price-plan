/**
 * Type definitions for the Video Storage Calculator application
 */

export type BillingCycle = 'monthly' | 'annual';

export interface Plan {
  name: string;
  cost: number;
  storage: number;
  users: number | string;
  features: string[];
}

export interface EnterprisePlan extends Plan {
  isEnterprise: true;
  /** Monthly equivalent of fixed annual base (e.g. $1,125/yr ÷ 12). */
  baseCost: number;
  /** Pre-paid quota charges (annual) beyond included 1.2 TB. */
  additionalCost: number;
  tierRate: number;
}

export interface Plans {
  monthly: {
    growth: Plan;
    pro: Plan;
    business: Plan;
  };
  annual: {
    starter: Plan;
    growth: Plan;
    pro: Plan;
    business: Plan;
  };
}

export interface CalculationResult {
  totalStorage: number;
  hdStorage: number;
  fourKStorage: number;
  recommendedPlan: Plan | EnterprisePlan | null;
  allPlans: Plans['monthly'] | Plans['annual'];
}

export interface StorageInputs {
  films: string;
  duration: string;
  fourKPercent: string;
}



