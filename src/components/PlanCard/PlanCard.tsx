/**
 * Plan Card Component
 * Displays individual pricing plan details
 */

import React from 'react';
import { Check, Database, Eye, EyeOff, Users } from 'lucide-react';
import type { Plan, BillingCycle } from '../../types';
import { formatStorage } from '../../utils/storage';

interface WhyRecommendationOption {
  name: string;
  baseCost: number;
  additionalGB: number;
  additionalCost: number;
  totalCost: number;
}

interface PlanCardProps {
  plan: Plan;
  billingCycle: BillingCycle;
  isRecommended: boolean;
  meetsRequirement: boolean;
  requiredStorage?: number;
  comparisonOptions?: WhyRecommendationOption[];
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  billingCycle,
  isRecommended,
  meetsRequirement,
  requiredStorage = 0,
  comparisonOptions = []
}) => {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const selectedOption = comparisonOptions.find((option) => option.name === plan.name);

  React.useEffect(() => {
    if (!isRecommended) {
      setIsFlipped(false);
    }
  }, [isRecommended]);

  return (
    <div className="h-full [perspective:1200px]">
      <div
        className="relative h-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* ── FRONT SIDE ── */}
        <div
          className={`relative rounded-lg overflow-hidden transition-all duration-200 flex flex-col h-full [backface-visibility:hidden] ${
            isRecommended
              ? 'bg-white border border-[#AD0FF0] shadow-sm'
              : meetsRequirement
              ? 'bg-white border border-gray-200 shadow-sm hover:border-gray-300'
              : 'bg-gray-50 border border-gray-200 shadow-sm opacity-60'
          }`}
        >
          {isRecommended && (
            <div className="bg-gradient-to-r from-[#594AE0] to-[#AD0FF0] text-white text-center py-2 px-4">
              <span className="text-xs font-semibold uppercase tracking-wider">Recommended</span>
            </div>
          )}

          <div className="p-6 flex flex-col flex-grow">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">{plan.name}</h3>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold text-gray-900">
                    ${billingCycle === 'annual' ? Math.round(plan.cost) : plan.cost}
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
                    <p className="text-xs text-gray-500">Upload quota</p>
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
                    <Check className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              {isRecommended && (
                <button
                  type="button"
                  className="cursor-pointer w-full mb-3 py-2 rounded border border-[#AD0FF0]/20 text-[#AD0FF0] bg-gradient-to-r from-[#594AE0]/10 to-[#AD0FF0]/10 text-sm font-medium hover:bg-gradient-to-r hover:from-[#594AE0]/20 hover:to-[#AD0FF0]/20 transition-colors flex items-center justify-center gap-2"
                  onClick={() => setIsFlipped(true)}
                >
                  <Eye className="w-4 h-4" />
                  Why Recommended
                </button>
              )}

              {!meetsRequirement && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  Insufficient upload quota for your needs
                </div>
              )}

              {meetsRequirement ? (
                <a
                  href="https://mediazilla.com/onboarding"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 rounded font-medium text-sm transition-colors block text-center ${
                    isRecommended
                      ? 'bg-gradient-to-r from-[#594AE0] to-[#AD0FF0] text-white hover:opacity-90 cursor-pointer'
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

        {/* ── BACK SIDE (redesigned) ── */}
        <div className="absolute inset-0 rounded-lg border border-[#AD0FF0] bg-white shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden flex flex-col">
          {/* Header stripe */}
          <div className="bg-gradient-to-r from-[#594AE0] to-[#AD0FF0] px-5 py-3 flex items-center justify-between flex-shrink-0">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white">Why Recommended</p>
              <h3 className="text-base font-semibold text-white mt-0.5">{plan.name}</h3>
            </div>
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs text-white hover:text-white transition-colors cursor-pointer bg-gradient-to-r from-[#594AE0]/90 to-[#AD0FF0]/90 hover:opacity-90 px-2.5 py-1.5 rounded-full"
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
                <span className="text-xs font-medium text-gray-700">{formatStorage(requiredStorage)} required</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#594AE0] to-[#AD0FF0] rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, (requiredStorage / plan.storage) * 100)}%`
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-gray-400">0</span>
                <span className="text-[10px] text-gray-400">{formatStorage(plan.storage)} included</span>
              </div>
            </div>

            {/* Cost breakdown */}
            {selectedOption ? (
              <div className="flex flex-col gap-2 flex-grow">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">Cost Breakdown</p>

                <div className="flex flex-col gap-1.5 text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Base plan / month</span>
                    <span className="font-medium text-gray-800">
                      ${billingCycle === 'annual' ? Math.round(selectedOption.baseCost) : selectedOption.baseCost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">
                      Pay as you go
                      <span className="ml-1 text-xs text-gray-400">({formatStorage(selectedOption.additionalGB)})</span>
                    </span>
                    <span className="font-medium text-gray-800">${selectedOption.additionalCost.toFixed(2)}/yr</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Annual billing cycle</span>
                      <span className="font-medium text-gray-800">${(selectedOption.baseCost * 12 + selectedOption.additionalCost).toFixed(0)}</span>
                    </div>
                  )}
                </div>

                {/* Total callout */}
                <div className="mt-auto bg-gradient-to-r from-[#594AE0]/10 to-[#AD0FF0]/10 border border-[#AD0FF0]/20 rounded-lg px-4 py-3 flex items-center justify-between">
                  {billingCycle === 'monthly' ? (
                    <>
                      <span className="text-sm font-semibold text-[#AD0FF0]">Pay today</span>
                      <span className="text-lg font-bold text-[#AD0FF0]">
                        ${selectedOption.baseCost.toFixed(2)}
                        <span className="text-xs font-medium text-[#AD0FF0]/70">/month</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-semibold text-[#AD0FF0]">Pay today</span>
                      <span className="text-lg font-bold text-[#AD0FF0]">
                        ${(selectedOption.baseCost * 12).toFixed(0)}
                        <span className="text-xs font-medium text-[#AD0FF0]/70">/yr</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-grow items-center justify-center text-sm text-gray-400 italic">
                Breakdown unavailable
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};