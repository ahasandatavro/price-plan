/**
 * Results Summary Component
 * Displays calculated storage requirements and recommended plan
 */

import React, { useMemo, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import type { BillingCycle, CalculationResult } from '../../types';
import {
  calculateOnDemandAdditionalCost,
  getEnterpriseTierSelection,
  formatStorage,
  getOnDemandTierSelection
} from '../../utils/storage';
import { getRangeComparisonForStorage } from '../../utils/planRecommendation';

interface ResultsSummaryProps {
  result: CalculationResult;
  billingCycle: BillingCycle;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ result, billingCycle }) => {
  const hasData = result.totalStorage > 0 && result.recommendedPlan;
  const recommendedPlan = result.recommendedPlan;

  const [whyOpen, setWhyOpen] = useState(false);

  const whyData = useMemo(() => {
    if (!recommendedPlan || result.totalStorage <= 0) return null;

    const requiredGB = result.totalStorage;
    const isEnterprise = (recommendedPlan as any).isEnterprise === true;
    const baseMultiplier = billingCycle === 'annual' ? 12 : 1;

    if (isEnterprise) {
      const baseCost = (recommendedPlan as any).baseCost ?? recommendedPlan.cost;
      const additionalCost = (recommendedPlan as any).additionalCost ?? 0;
      const businessPlan = (result.allPlans as any).business;
      const additionalGB = Math.max(0, requiredGB - (businessPlan?.storage ?? requiredGB));

      return {
        requiredGB,
        recommended: {
          name: recommendedPlan.name,
          baseCost: baseCost * baseMultiplier,
          additionalGB,
          additionalCost,
          totalCost: baseCost * baseMultiplier + additionalCost
        },
        alternatives: [] as Array<{
          name: string;
          baseCost: number;
          additionalGB: number;
          additionalCost: number;
          totalCost: number;
        }>
      };
    }

    const comparison = getRangeComparisonForStorage(requiredGB, result.allPlans, billingCycle);
    const recommendedOption = comparison.options.find((option) => option.name === recommendedPlan.name);

    const fallbackAdditionalGB = Math.max(0, requiredGB - recommendedPlan.storage);
    const fallbackAdditionalCost = calculateOnDemandAdditionalCost(fallbackAdditionalGB);
    const fallbackTotalCost = recommendedPlan.cost * baseMultiplier + fallbackAdditionalCost;

    const recommendedCostData = recommendedOption ?? {
      name: recommendedPlan.name,
      baseCost: recommendedPlan.cost * baseMultiplier,
      additionalGB: fallbackAdditionalGB,
      additionalCost: fallbackAdditionalCost,
      totalCost: fallbackTotalCost
    };

    const alternatives = comparison.options.filter((option) => option.name !== recommendedCostData.name);

    return {
      requiredGB,
      recommended: {
        name: recommendedCostData.name,
        baseCost: recommendedCostData.baseCost,
        additionalGB: recommendedCostData.additionalGB,
        additionalCost: recommendedCostData.additionalCost,
        totalCost: recommendedCostData.totalCost
      },
      alternatives
    };
  }, [billingCycle, recommendedPlan, result.allPlans, result.totalStorage]);

  const userValue = recommendedPlan?.users;
  const userWord =
    typeof userValue === 'number'
      ? userValue === 1
        ? 'user'
        : 'users'
      : 'users';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mt-6">
      {hasData && recommendedPlan ? (
        <>
          {/* Storage Summary */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Required Upload Quota</p>
              <p className="text-2xl font-semibold text-gray-900">{formatStorage(result.totalStorage)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">HD: {formatStorage(result.hdStorage)}</p>
              <p className="text-xs text-gray-500">4K: {formatStorage(result.fourKStorage)}</p>
            </div>
          </div>
          
          {/* Recommended Plan */}
          <div className="bg-blue-50 rounded border border-blue-200 p-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Recommended</span>
            </div>
            
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">{recommendedPlan.name}</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {formatStorage(recommendedPlan.storage)}
                  {' • '}
                  {userValue} {userWord}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-gray-900">${recommendedPlan.cost.toFixed(2)}</p>
                <p className="text-xs text-gray-600">/month</p>
              </div>
            </div>

            <div className="mt-3">
              <button
                type="button"
                className="text-xs text-blue-700 underline hover:text-blue-800 cursor-pointer"
                onClick={() => setWhyOpen((v) => !v)}
              >
                Why recommended?
              </button>

              {whyOpen && whyData && (
                <div className="mt-3 p-3 bg-white border border-gray-200 rounded">
                  <div className="text-sm font-semibold text-gray-900 mb-2">
                    Total cost with on-demand top-up
                  </div>

                  <div className="text-xs text-gray-700 leading-relaxed">
                    <div>
                      Required quota: <span className="font-medium">{formatStorage(whyData.requiredGB)}</span>
                    </div>
                    <div className="mt-1">
                      {whyData.recommended.name}: base ${whyData.recommended.baseCost.toFixed(2)} + on-demand
                      {whyData.recommended.additionalGB > 0
                        ? ` ${formatStorage(whyData.recommended.additionalGB)} (${whyData.recommended.additionalCost.toFixed(2)})`
                        : ' (no extra needed)'}
                      = <span className="font-medium">${whyData.recommended.totalCost.toFixed(2)}</span>
                    </div>

                    <div className="mt-2">
                      Compared within current range (current tier + next tier only).
                    </div>

                    <div className="mt-2 p-2 rounded border border-blue-100 bg-blue-50">
                      <div className="font-medium text-gray-900">
                        {(recommendedPlan as any).isEnterprise === true
                          ? 'Enterprise prepaid quota rates (after first 1.2 TB)'
                          : 'On-demand tier rates'}
                      </div>
                      {(recommendedPlan as any).isEnterprise === true ? (
                        <>
                          <div className="mt-1">0 TB - 1.2 TB: $0.9375/GB</div>
                          <div>1.2 TB - 2.4 TB: $0.875/GB</div>
                          <div>2.4 TB - 5.0 TB: $0.8125/GB</div>
                          <div>5.0 TB - 10.0 TB: $0.75/GB</div>
                        </>
                      ) : (
                        <>
                          <div className="mt-1">0 TB - 1.2 TB: $1.110/GB</div>
                          <div>1.2 TB - 2.4 TB: $1.00/GB</div>
                          <div>2.4 TB - 5.0 TB: $0.90/GB</div>
                          <div>5.0 TB - 10.0 TB: $0.82/GB</div>
                        </>
                      )}
                      {(() => {
                        const selectedTier =
                          (recommendedPlan as any).isEnterprise === true
                            ? getEnterpriseTierSelection(whyData.recommended.additionalGB)
                            : getOnDemandTierSelection(whyData.recommended.additionalGB);
                        if (!selectedTier) return <div className="mt-1">Selected tier: no extra top-up needed</div>;
                        return (
                          <div className="mt-1 font-medium text-blue-700">
                            Selected tier: {selectedTier.label} at ${selectedTier.rate.toFixed(3)}/GB
                          </div>
                        );
                      })()}
                    </div>

                    {whyData.alternatives.length > 0 ? (
                      whyData.alternatives.map((option) => (
                        <div key={option.name} className="mt-2">
                          {option.name}: base ${option.baseCost.toFixed(2)} + on-demand
                          {option.additionalGB > 0
                            ? ` ${formatStorage(option.additionalGB)} (${option.additionalCost.toFixed(2)})`
                            : ' (no extra needed)'}
                          = <span className="font-medium">${option.totalCost.toFixed(2)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="mt-2 text-gray-500">
                        No next-tier comparison is available for this range.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-5 md:py-16 lg:py-24">
          <p className="text-gray-500 text-sm">
            Input values to show your storage quote and pricing
          </p>
        </div>
      )}
    </div>
  );
};
