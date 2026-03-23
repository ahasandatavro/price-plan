/**
 * Enterprise Plan Card Component
 * Displays custom enterprise plan with pricing breakdown
 */

import React from 'react';
import { Check, Users, Database, HelpCircle, EyeOff } from 'lucide-react';
import type { EnterprisePlan, BillingCycle } from '../../types';
import { MEDIAZILLA_ENTERPRISE_CONTACT_URL, ENTERPRISE_ANNUAL_BASE_USD } from '../../constants/plans';
import { formatStorage } from '../../utils/storage';

interface EnterprisePlanCardProps {
  plan: EnterprisePlan;
  billingCycle: BillingCycle;
  requiredStorage?: number;
  isRecommended?: boolean;
  showPlaceholder?: boolean;
  isRecommendationLocked?: boolean;
}

export const EnterprisePlanCard: React.FC<EnterprisePlanCardProps> = ({
  plan,
  billingCycle: _billingCycle,
  requiredStorage = 0,
  isRecommended = false,
  showPlaceholder = false,
  isRecommendationLocked = false
}) => {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const additionalGB = Math.max(0, requiredStorage - 1228.8);
  const baseAnnualCost = plan.baseCost * 12;
  const totalAnnualCost = baseAnnualCost + plan.additionalCost;
  const isPlaceholder = showPlaceholder || requiredStorage <= 0;
  /** Parent passes true when this card should blur (locked tier). */
  const isLockedNonRecommended = isRecommendationLocked;

  return (
    <div
      className={`h-full [perspective:1200px] ${isLockedNonRecommended ? 'pointer-events-none select-none' : ''}`}
    >
      <div
        className="relative h-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        <div
          className={`relative rounded-lg overflow-hidden transition-all duration-200 flex flex-col h-full [backface-visibility:hidden] ${
            isRecommended
              ? 'bg-white border border-[#AD0FF0] shadow-sm'
              : 'bg-white border border-gray-200 shadow-sm hover:border-gray-300'
          } ${isLockedNonRecommended ? 'blur-sm opacity-40' : ''}`}
        >
          {!isPlaceholder && !isLockedNonRecommended && (
            <div
              className={`text-white text-center py-2 px-4 ${
                isRecommended ? 'bg-gradient-to-r from-[#594AE0] to-[#AD0FF0]' : 'bg-gray-900'
              }`}
            >
              <span className="text-xs font-semibold uppercase tracking-widest">
                {isRecommended ? 'Recommended' : 'Enterprise Plan'}
              </span>
            </div>
          )}

          <div className="p-6 flex flex-col flex-grow">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Enterprise</h3>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold text-gray-900">
                    {isPlaceholder ? '**' : `$${totalAnnualCost.toFixed(2)}`}
                  </span>
                  <span className="text-gray-600 text-base">{isPlaceholder ? '' : '/year'}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {isPlaceholder
                    ? '**'
                    : `Annual: $${ENTERPRISE_ANNUAL_BASE_USD.toLocaleString()}/yr + Additional pre-paid quota charges`}
                </p>
              </div>

              <div className="flex items-center gap-4 py-3 px-4 bg-gray-50 rounded border border-gray-200">
                <div className="flex items-center gap-2 flex-1">
                  <Database className="w-4 h-4 text-gray-600" />
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Upload quota</p>
                    <p className="text-sm font-medium text-gray-900">
                      {isPlaceholder ? '**' : formatStorage(plan.storage)}
                    </p>
                  </div>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="flex items-center gap-2 flex-1">
                  <Users className="w-4 h-4 text-gray-600" />
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Users</p>
                    <p className="text-sm font-medium text-gray-900">5+</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-6 flex-grow">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="mt-0.5 flex-shrink-0">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              {!isPlaceholder && (
                <button
                  type="button"
                  className={`cursor-pointer w-full mb-3 py-2 rounded border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    isRecommended
                      ? 'border-[#AD0FF0]/30 text-[#594AE0] bg-white hover:bg-[#AD0FF0]/10'
                      : 'border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsFlipped(true)}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isRecommended ? 'bg-[#594AE0]/10' : 'bg-gray-100'
                    }`}
                  >
                    <HelpCircle
                      className={`w-3.5 h-3.5 ${isRecommended ? 'text-[#594AE0]' : 'text-gray-600'}`}
                      aria-hidden
                    />
                  </span>
                  Price breakdown
                </button>
              )}

              <a
                href={MEDIAZILLA_ENTERPRISE_CONTACT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 rounded font-medium text-sm transition-colors cursor-pointer block text-center ${
                  isRecommended
                    ? 'bg-gradient-to-r from-[#594AE0] to-[#AD0FF0] text-white hover:opacity-90'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Contact Sales Team
              </a>
            </div>
          </div>
        </div>

        <div
          className={`absolute inset-0 rounded-lg border border-gray-300 bg-white shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden flex flex-col ${
            isLockedNonRecommended ? 'blur-sm opacity-40' : ''
          }`}
        >
          <div
            className={`px-5 py-3 flex items-center justify-between flex-shrink-0 ${
              isRecommended
                ? 'bg-gradient-to-r from-[#594AE0] to-[#AD0FF0]'
                : 'bg-gradient-to-r from-gray-600 to-gray-700'
            }`}
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white">
                Price breakdown
              </p>
              <h3 className="text-base font-semibold text-white mt-0.5">{plan.name}</h3>
            </div>
            <button
              type="button"
              className={`flex items-center gap-1.5 text-xs text-white hover:text-white transition-colors cursor-pointer px-2.5 py-1.5 rounded-full ${
                isRecommended
                  ? 'bg-gradient-to-r from-[#594AE0]/90 to-[#AD0FF0]/90 hover:opacity-90'
                  : 'bg-gray-800/90 hover:bg-gray-800'
              }`}
              onClick={() => setIsFlipped(false)}
            >
              <EyeOff className="w-3 h-3" />
              Back
            </button>
          </div>

          <div className="flex flex-col flex-grow p-5 gap-4 overflow-auto">
            {/* Quota meter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Upload Quota</span>
                <span className="text-xs font-medium text-gray-700">
                  {isPlaceholder ? '** required' : `${formatStorage(requiredStorage)} required`}
                </span>
              </div>

              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isRecommended ? 'bg-gradient-to-r from-[#594AE0] to-[#AD0FF0]' : 'bg-gray-700'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      !isPlaceholder && plan.storage > 0 ? (requiredStorage / plan.storage) * 100 : 0
                    )}%`
                  }}
                />
              </div>

              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-gray-400">0</span>
                <span className="text-[10px] text-gray-400">
                  {isPlaceholder ? '** included' : `${formatStorage(plan.storage)} included`}
                </span>
              </div>
            </div>

            {/* Cost breakdown */}
            <div className="flex flex-col gap-2 flex-grow">
           

              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Enterprise base (annual)</span>
                  <span className="font-medium text-gray-800">
                    {isPlaceholder ? '**' : `$${baseAnnualCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">
                    Pre-paid quota
                    <span className="ml-1 text-xs text-gray-400">
                      ({isPlaceholder ? '**' : formatStorage(additionalGB)})
                    </span>
                  </span>
                  <span className="font-medium text-gray-800">
                    {isPlaceholder ? '**' : `$${plan.additionalCost.toFixed(2)}/yr`}
                  </span>
                </div>
              </div>

              {/* Total callout */}
              <div
                className={`mt-auto rounded-lg px-4 py-3 flex items-center justify-between ${
                  isRecommended
                    ? 'bg-gradient-to-r from-[#594AE0]/10 to-[#AD0FF0]/10 border border-[#AD0FF0]/20'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <span className={`text-sm font-semibold ${isRecommended ? 'text-[#AD0FF0]' : 'text-gray-800'}`}>
                  Annual Total
                </span>
                <span className={`text-lg font-bold ${isRecommended ? 'text-[#AD0FF0]' : 'text-gray-900'}`}>
                  {isPlaceholder ? '**' : `$${(plan.baseCost * 12 + plan.additionalCost).toFixed(2)}`}
                  {!isPlaceholder && (
                    <span
                      className={`text-xs font-medium ${isRecommended ? 'text-[#AD0FF0]/70' : 'text-gray-500'}`}
                    >
                      /yr
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
