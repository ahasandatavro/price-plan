/**
 * Billing Cycle Toggle Component
 * Allows users to switch between monthly and annual billing
 */

import React from 'react';
import type { BillingCycle } from '../../types';

interface BillingToggleProps {
  billingCycle: BillingCycle;
  onToggle: (cycle: BillingCycle) => void;
}

export const BillingToggle: React.FC<BillingToggleProps> = ({ billingCycle, onToggle }) => {
  return (
    <div className="mb-6">
      <label className="text-sm font-semibold text-gray-700 mb-2 block">
        Billing Cycle
      </label>
      <div className="flex gap-4">
        <button
          onClick={() => onToggle('monthly')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
            billingCycle === 'monthly'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => onToggle('annual')}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
            billingCycle === 'annual'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Annual (Save up to 15%)
        </button>
      </div>
    </div>
  );
};

