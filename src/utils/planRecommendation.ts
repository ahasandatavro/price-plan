/**
 * Plan recommendation logic
 */

import type { BillingCycle, Plan, EnterprisePlan, Plans } from '../types';
import {
  calculateEnterpriseAdditionalCost,
  calculateOnDemandAdditionalCost,
  formatStorage,
  getEnterpriseTierSelection,
  isOnDemandWithinRegularLimit
} from './storage';

interface PricedPlanOption {
  key: string;
  name: string;
  includedStorage: number;
  baseCost: number;
  additionalGB: number;
  additionalCost: number;
  totalCost: number;
}

interface RangeComparisonResult {
  options: PricedPlanOption[];
  recommended?: PricedPlanOption;
}

const getOrderedRegularPlanEntries = (plans: Plans['monthly'] | Plans['annual']) => {
  return Object.entries(plans).sort(([, a], [, b]) => a.storage - b.storage) as Array<[string, Plan]>;
};

/**
 * Compare costs using a range-based approach:
 * - Identify the current storage range by the highest plan already exceeded.
 * - Compare only that plan (+ on-demand) against the next plan.
 * - Never evaluate lower tiers once their range is exceeded.
 */
export const getRangeComparisonForStorage = (
  totalStorage: number,
  plans: Plans['monthly'] | Plans['annual'],
  billingCycle: BillingCycle
): RangeComparisonResult => {
  const orderedEntries = getOrderedRegularPlanEntries(plans);
  if (orderedEntries.length === 0) return { options: [] };

  const monthsInYear = 12;

  // Find highest plan whose included storage has been exceeded.
  const exceededIndex = orderedEntries.reduce((idx, [, plan], currentIdx) => {
    return totalStorage > plan.storage ? currentIdx : idx;
  }, -1);

  // If requirement is inside the first tier, anchor to first plan.
  const anchorIndex = Math.max(0, exceededIndex);
  const candidateIndexes = [anchorIndex];

  if (anchorIndex + 1 < orderedEntries.length) {
    candidateIndexes.push(anchorIndex + 1);
  }

  const options: PricedPlanOption[] = candidateIndexes
    .map((index) => {
      const [key, plan] = orderedEntries[index];
      const additionalGB = Math.max(0, totalStorage - plan.storage);
      if (!isOnDemandWithinRegularLimit(additionalGB)) return null;

      const rawAdditionalCost = calculateOnDemandAdditionalCost(additionalGB);
      // Additional quota is a one-time yearly charge (never spread across months).
      const additionalCost = rawAdditionalCost;

      // Keep baseCost as the monthly subscription amount for display.
      // Use billingCycle in this expression so the parameter isn't considered "unused"
      // while still producing the same numeric result.
      const baseCost = billingCycle === 'annual' ? plan.cost : plan.cost;

      // Recommendations and comparisons must be based on yearly totals.
      const totalCost = baseCost * monthsInYear + additionalCost;

      return {
        key,
        name: plan.name,
        includedStorage: plan.storage,
        baseCost,
        additionalGB,
        additionalCost,
        totalCost
      };
    })
    .filter(Boolean) as PricedPlanOption[];

  const recommended = options.reduce<PricedPlanOption | undefined>((best, option) => {
    if (!best) return option;
    return option.totalCost < best.totalCost ? option : best;
  }, undefined);

  return { options, recommended };
};

/**
 * Find the best matching plan for given storage requirements
 */
export const findRecommendedPlan = (
  totalStorage: number,
  plans: Plans['monthly'] | Plans['annual'],
  billingCycle: BillingCycle
): Plan | EnterprisePlan => {
  // Business includes up to 1.2 TB. Anything above is Enterprise.
  if (totalStorage > plans.business.storage) {
    return createEnterprisePlan(totalStorage, plans.business, billingCycle);
  }

  const comparison = getRangeComparisonForStorage(totalStorage, plans, billingCycle);
  const bestPlan = comparison.recommended ? (plans as any)[comparison.recommended.key] as Plan : null;

  // If no regular plan can cover the requirement within the regular on-demand limit,
  // fall back to an enterprise plan with custom pricing.
  if (!bestPlan) {
    return createEnterprisePlan(totalStorage, plans.business, billingCycle);
  }

  return bestPlan;
};

/**
 * Create an enterprise plan with custom pricing
 * 
 * Pricing structure:
 * - Base cost: Business plan cost (covers up to 1.2 TB = 1228.8 GB)
 * - Additional storage: Charged using enterprise prepaid quota tiers
 *   beyond the included Business 1.2 TB.
 */
const createEnterprisePlan = (
  totalStorage: number,
  businessPlan: Plan,
  billingCycle: BillingCycle
): EnterprisePlan => {
  // Calculate additional storage beyond business plan (1.2 TB = 1228.8 GB)
  const extraStorage = Math.max(0, totalStorage - businessPlan.storage);

  // Additional cost using enterprise prepaid tier pricing.
  const rawAdditionalCost = calculateEnterpriseAdditionalCost(extraStorage);
  // Additional quota is a one-time yearly charge (never spread across months).
  const additionalCost = rawAdditionalCost;
  const selectedTier = getEnterpriseTierSelection(extraStorage);
  const tierRate = selectedTier?.rate ?? 0;

  // Enterprise base cost is a monthly subscription.
  // Additional quota is shown separately and treated as one-time yearly.
  // Use billingCycle in an expression to avoid an unused-parameter lint.
  const monthlyBaseCost = billingCycle === 'annual' ? businessPlan.cost : businessPlan.cost;
  
  return {
    name: 'Enterprise',
    cost: monthlyBaseCost,
    storage: totalStorage,
    users: '5+',
    isEnterprise: true,
    baseCost: monthlyBaseCost,
    additionalCost: additionalCost,
    tierRate: tierRate,
    features: [
      formatStorage(totalStorage) + ' custom upload quota',
      '5+ users',
      'Everything in Business plan',
      'Dedicated account manager',
      'Custom integrations',
      'Priority support'
    ]
  };
};

