/**
 * Results Summary Component
 * Displays calculated storage requirements and recommended plan
 */

import React from 'react';
import { CheckCircle } from 'lucide-react';
import type { BillingCycle, CalculationResult } from '../../types';
import { formatStorage } from '../../utils/storage';

interface ResultsSummaryProps {
  result: CalculationResult;
  billingCycle: BillingCycle;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ result }) => {
  const hasData = result.totalStorage > 0 && result.recommendedPlan;
  const recommendedPlan = result.recommendedPlan;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mt-6">
      {hasData && recommendedPlan ? (
        <>
          {/* Storage Summary */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Required Storage</p>
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
                  {formatStorage(recommendedPlan.storage)} • {recommendedPlan.users} user{recommendedPlan.users !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-gray-900">${recommendedPlan.cost.toFixed(2)}</p>
                <p className="text-xs text-gray-600">/month</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-sm">
            Input values to show your storage quote and pricing
          </p>
        </div>
      )}
    </div>
  );
};