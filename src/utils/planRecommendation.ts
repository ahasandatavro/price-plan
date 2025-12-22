/**
 * Plan recommendation logic
 */

import type { Plan, EnterprisePlan, Plans } from '../types';
import { getEnterpriseTierRate, formatStorage } from './storage';

/**
 * Find the best matching plan for given storage requirements
 */
export const findRecommendedPlan = (
  totalStorage: number,
  plans: Plans['monthly'] | Plans['annual']
): Plan | EnterprisePlan => {
  const planKeys = Object.keys(plans) as Array<keyof typeof plans>;
  
  // Try to find a plan that meets the storage requirement
  for (const key of planKeys) {
    const plan = plans[key];
    if (plan.storage >= totalStorage) {
      return plan;
    }
  }
  
  // If no plan meets requirements, create enterprise plan
  return createEnterprisePlan(totalStorage, plans.business);
};

/**
 * Create an enterprise plan with custom pricing
 * 
 * Pricing structure:
 * - Base cost: Business plan cost (covers up to 1.2 TB = 1228.8 GB)
 * - Additional storage: Charged based on tier that total storage falls into
 *   - 1.2 TB - 2.4 TB: $0.875 per GB for additional storage
 *   - 2.4 TB - 5 TB: $0.8125 per GB for additional storage
 *   - 5 TB - 10 TB: $0.75 per GB for additional storage
 */
const createEnterprisePlan = (
  totalStorage: number,
  businessPlan: Plan
): EnterprisePlan => {
  // Calculate additional storage beyond business plan (1.2 TB = 1228.8 GB)
  const extraStorage = totalStorage - businessPlan.storage;
  
  // Get tier rate based on which tier the TOTAL storage falls into
  const tierRate = getEnterpriseTierRate(totalStorage);
  
  // Calculate additional cost: extra storage × tier rate
  const additionalCost = extraStorage * tierRate;
  
  // Total cost: business plan base + additional storage cost
  const totalCost = businessPlan.cost + additionalCost;
  
  return {
    name: 'Enterprise',
    cost: totalCost,
    storage: totalStorage,
    users: '5+',
    isEnterprise: true,
    baseCost: businessPlan.cost,
    additionalCost: additionalCost,
    tierRate: tierRate,
    features: [
      formatStorage(totalStorage) + ' custom storage',
      '5+ users',
      'Everything in Business plan',
      'Dedicated account manager',
      'Custom integrations',
      'Priority support'
    ]
  };
};

