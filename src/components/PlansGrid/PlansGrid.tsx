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
    return plan.isEnterprise === true;
  };

  return (
    <div className="mb-8">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
          Choose Your Perfect Plan
        </h2>
        <p className="text-lg text-gray-600">
          Select the plan that best fits your video storage needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(result.allPlans).map(([key, plan]) => {
          const isRecommended = 
            plan.name === result.recommendedPlan.name && 
            !isEnterprisePlan(result.recommendedPlan);
          const meetsRequirement = plan.storage >= result.totalStorage;
          
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

        {isEnterprisePlan(result.recommendedPlan) && (
          <EnterprisePlanCard
            plan={result.recommendedPlan}
            billingCycle={billingCycle}
          />
        )}
      </div>
    </div>
  );
};

