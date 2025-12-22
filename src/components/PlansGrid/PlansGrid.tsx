/**
 * Plans Grid Component
 * Displays all available plans in a grid layout
 */

import React from 'react';
import type { CalculationResult, BillingCycle, EnterprisePlan } from '../../types';
import { PlanCard } from '../PlanCard/PlanCard';
import { EnterprisePlanCard } from '../EnterprisePlanCard/EnterprisePlanCard';

interface PlansGridProps {
  result: CalculationResult;
  billingCycle: BillingCycle;
}

export const PlansGrid: React.FC<PlansGridProps> = ({ result, billingCycle }) => {
  const isEnterprisePlan = (plan: any): plan is EnterprisePlan => {
    return plan?.isEnterprise === true;
  };

  const hasCalculation = result.totalStorage > 0 && result.recommendedPlan !== null;

  // Sort plans so recommended plan appears first
  const planEntries = Object.entries(result.allPlans);
  const sortedPlans = [...planEntries].sort(([_keyA, planA], [_keyB, planB]) => {
    // Check if planA is recommended
    const isPlanARecommended = 
      hasCalculation &&
      result.recommendedPlan !== null &&
      planA.name === result.recommendedPlan.name && 
      !isEnterprisePlan(result.recommendedPlan);
    
    // Check if planB is recommended
    const isPlanBRecommended = 
      hasCalculation &&
      result.recommendedPlan !== null &&
      planB.name === result.recommendedPlan.name && 
      !isEnterprisePlan(result.recommendedPlan);
    
    // Recommended plan should come first
    if (isPlanARecommended && !isPlanBRecommended) return -1;
    if (!isPlanARecommended && isPlanBRecommended) return 1;
    return 0; // Keep original order for non-recommended plans
  });

  return (
    <div className="mb-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
          Choose Your Perfect Plan
        </h2>
        <p className="text-lg text-gray-600">
          {hasCalculation 
            ? 'Select the plan that best fits your video storage needs'
            : 'Explore our available plans'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Render enterprise plan first if it's recommended */}
        {hasCalculation && result.recommendedPlan && isEnterprisePlan(result.recommendedPlan) && (
          <EnterprisePlanCard
            plan={result.recommendedPlan}
            billingCycle={billingCycle}
          />
        )}

        {/* Render regular plans (with recommended plan first) */}
        {sortedPlans.map(([key, plan]) => {
          const isRecommended = 
            hasCalculation &&
            result.recommendedPlan !== null &&
            plan.name === result.recommendedPlan.name && 
            !isEnterprisePlan(result.recommendedPlan);
          const meetsRequirement = !hasCalculation || plan.storage >= result.totalStorage;
          
          return (
            <PlanCard
              key={key}
              plan={plan}
              billingCycle={billingCycle}
              isRecommended={isRecommended}
              meetsRequirement={meetsRequirement}
            />
          );
        })}
      </div>
    </div>
  );
};

