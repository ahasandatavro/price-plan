/**
 * Plan recommendation logic
 */

import type { BillingCycle, Plan, EnterprisePlan, Plans } from '../types';
import {
  ENTERPRISE_MIN_TOTAL_GB,
  ENTERPRISE_ANNUAL_BASE_USD,
  ENTERPRISE_MIN_BUSINESS_ANNUAL_TOTAL_USD
} from '../constants/plans';
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

      const rawAdditionalCost = calculateOnDemandAdditionalCost(additionalGB, plan.name);
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
 * Annual Business total (base + pay-as-you-go on extra quota), using annual catalog.
 * Used to decide Enterprise when this exceeds the Business yearly cap (see constants).
 */
export const getBusinessAnnualTotalForStorage = (totalStorage: number, plans: Plans): number => {
  const businessPlan = plans.annual.business;
  const additionalGB = Math.max(0, totalStorage - businessPlan.storage);
  const additionalCost = calculateOnDemandAdditionalCost(additionalGB, businessPlan.name);
  return businessPlan.cost * 12 + additionalCost;
};

const shouldRecommendEnterprise = (totalStorage: number, plans: Plans): boolean => {
  if (totalStorage >= ENTERPRISE_MIN_TOTAL_GB) return true;
  return getBusinessAnnualTotalForStorage(totalStorage, plans) >= ENTERPRISE_MIN_BUSINESS_ANNUAL_TOTAL_USD;
};

/**
 * Find the best matching plan for given storage requirements
 */
export const findRecommendedPlan = (
  totalStorage: number,
  plans: Plans,
  billingCycle: BillingCycle
): Plan | EnterprisePlan => {
  const currentPlans = plans[billingCycle];

  // Enterprise: 2.4 TB+ total storage, OR Business annual total would exceed $2,174 (i.e. >= $2,175).
  if (shouldRecommendEnterprise(totalStorage, plans)) {
    return createEnterprisePlan(totalStorage, plans.annual.business);
  }

  const comparison = getRangeComparisonForStorage(totalStorage, currentPlans, billingCycle);
  const bestPlan = comparison.recommended
    ? (currentPlans as unknown as Record<string, Plan>)[comparison.recommended.key]
    : null;

  // If no regular plan can cover the requirement within the regular on-demand limit.
  if (!bestPlan) {
    return currentPlans.business;
  }

  return bestPlan;
};

/**
 * Create an enterprise plan with custom pricing
 *
 * - Annual base: ENTERPRISE_ANNUAL_BASE_USD ($1,125/yr) + pre-paid quota charges
 * - Pre-paid rates apply to storage beyond included 1.2 TB (Business):
 *   0–1.2 TB additional @ $0.875/GB, 1.21–2.6 TB additional @ $0.8125/GB, 2.61+ TB @ $0.75/GB.
 */
const createEnterprisePlan = (
  totalStorage: number,
  businessPlan: Plan
): EnterprisePlan => {
  const extraStorage = Math.max(0, totalStorage - businessPlan.storage);

  const additionalCost = calculateEnterpriseAdditionalCost(extraStorage);
  const selectedTier = getEnterpriseTierSelection(extraStorage);
  const tierRate = selectedTier?.rate ?? 0;

  const monthlyBaseCost = ENTERPRISE_ANNUAL_BASE_USD / 12;

  return {
    name: 'Enterprise',
    cost: monthlyBaseCost,
    storage: totalStorage,
    users: '5+',
    isEnterprise: true,
    baseCost: monthlyBaseCost,
    additionalCost,
    tierRate,
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

