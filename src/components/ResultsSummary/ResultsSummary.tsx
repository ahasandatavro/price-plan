/**
 * Results Summary Component
 * Displays calculated storage requirements and recommended plan
 */

import React from 'react';
import type { BillingCycle, CalculationResult } from '../../types';
import { formatStorage } from '../../utils/storage';

interface ResultsSummaryProps {
  result: CalculationResult;
  billingCycle: BillingCycle;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ result, billingCycle }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-purple-100 text-sm mb-1">Your Required Storage</p>
          <p className="text-3xl font-bold">{formatStorage(result.totalStorage)}</p>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
          <p className="text-xs text-purple-100">HD: {formatStorage(result.hdStorage)}</p>
          <p className="text-xs text-purple-100">4K: {formatStorage(result.fourKStorage)}</p>
        </div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <p className="text-sm text-purple-100 mb-2">✨ Recommended Plan</p>
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-3xl font-bold">{result.recommendedPlan.name}</span>
          <span className="text-2xl font-bold">
            ${result.recommendedPlan.cost.toFixed(2)}
          </span>
          <span className="text-sm text-purple-100">
            {billingCycle === 'annual' ? '/month (billed annually)' : '/month'}
          </span>
        </div>
        <div className="flex gap-4 text-sm text-purple-100">
          <span>💾 {formatStorage(result.recommendedPlan.storage)}</span>
          <span>👥 {result.recommendedPlan.users} user{result.recommendedPlan.users !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
};

