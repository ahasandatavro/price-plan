/**
 * Plan Card Component
 * Displays individual pricing plan details
 */

import React from 'react';
import { Check, Database, Users } from 'lucide-react';
import type { Plan, BillingCycle } from '../../types';
import { formatStorage } from '../../utils/storage';

interface PlanCardProps {
  plan: Plan;
  billingCycle: BillingCycle;
  isRecommended: boolean;
  meetsRequirement: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  billingCycle,
  isRecommended,
  meetsRequirement
}) => {
  return (
    <div
      className={`relative rounded-lg overflow-hidden transition-all duration-200 flex flex-col h-full ${
        isRecommended
          ? 'bg-white border border-blue-600 shadow-sm'
          : meetsRequirement
          ? 'bg-white border border-gray-200 shadow-sm hover:border-gray-300'
          : 'bg-gray-50 border border-gray-200 shadow-sm opacity-60'
      }`}
    >
      {isRecommended && (
        <div className="bg-blue-600 text-white text-center py-2 px-4">
          <span className="text-xs font-semibold uppercase tracking-wider">Recommended</span>
        </div>
      )}
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">{plan.name}</h3>
          
          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-semibold text-gray-900">
                ${plan.cost}
              </span>
              <span className="text-gray-600 text-base">/month</span>
            </div>
            {billingCycle === 'annual' && plan.cost > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                ${(plan.cost * 12).toFixed(0)} billed annually
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 py-3 px-4 bg-gray-50 rounded border border-gray-200">
            <div className="flex items-center gap-2 flex-1">
              <Database className="w-4 h-4 text-gray-600" />
              <div className="text-left">
                <p className="text-xs text-gray-500">Storage</p>
                <p className="text-sm font-medium text-gray-900">{formatStorage(plan.storage)}</p>
              </div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="flex items-center gap-2 flex-1">
              <Users className="w-4 h-4 text-gray-600" />
              <div className="text-left">
                <p className="text-xs text-gray-500">Users</p>
                <p className="text-sm font-medium text-gray-900">{plan.users}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-6 flex-grow">
          {plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <div className="mt-0.5 flex-shrink-0">
                <Check className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          {!meetsRequirement && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              Insufficient storage for your needs
            </div>
          )}

          {meetsRequirement ? (
            <a
              href="https://mediazilla.com/onboarding"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-3 rounded font-medium text-sm transition-colors block text-center ${
                isRecommended
                  ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                  : 'bg-gray-900 text-white hover:bg-gray-800 cursor-pointer'
              }`}
            >
              Get Started
            </a>
          ) : (
            <button
              className="w-full py-3 rounded font-medium text-sm transition-colors bg-gray-200 text-gray-500 cursor-not-allowed"
              disabled
            >
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
};