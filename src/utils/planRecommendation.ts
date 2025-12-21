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
 */
const createEnterprisePlan = (
  totalStorage: number,
  businessPlan: Plan
): EnterprisePlan => {
  const extraStorage = totalStorage - businessPlan.storage;
  const tierRate = getEnterpriseTierRate(totalStorage);
  const additionalCost = extraStorage * tierRate;
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

