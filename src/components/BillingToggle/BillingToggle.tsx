/**
 * Billing Cycle Toggle Component
 * Allows users to switch between monthly and annual billing
 */

import React from 'react';
import type { BillingCycle } from '../../types';
import { ANNUAL_DISCOUNT_PERCENT } from '../../constants/plans';

interface BillingToggleProps {
  billingCycle: BillingCycle;
  onToggle: (cycle: BillingCycle) => void;
}

export const BillingToggle: React.FC<BillingToggleProps> = ({ billingCycle, onToggle }) => {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className={`text-sm font-medium transition-colors ${
        billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'
      }`}>
        Monthly
      </span>
      
      <button
        onClick={() => onToggle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
        style={{ backgroundColor: billingCycle === 'annual' ? '#2563eb' : '#d1d5db' }}
        role="switch"
        aria-checked={billingCycle === 'annual'}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      
      <span className={`text-sm font-medium transition-colors ${
        billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'
      }`}>
        Annual
        <span className="ml-1.5 text-xs text-green-600 font-semibold">Save {ANNUAL_DISCOUNT_PERCENT}%</span>
      </span>
    </div>
  );
};