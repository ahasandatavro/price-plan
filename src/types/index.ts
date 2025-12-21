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
  baseCost: number;
  additionalCost: number;
  tierRate: number;
}

export interface Plans {
  monthly: {
    free: Plan;
    growth: Plan;
    pro: Plan;
    business: Plan;
  };
  annual: {
    free: Plan;
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



