/**
 * Plan Card Component
 * Displays individual pricing plan details
 */

import React from 'react';
import { Check, Database, EyeOff, HelpCircle, Plus, Users } from 'lucide-react';
import type { Plan, BillingCycle } from '../../types';
import {
  calculateOnDemandAdditionalCost,
  formatStorage,
  isOnDemandWithinRegularLimit
} from '../../utils/storage';

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
  isContentSellBlocked?: boolean;
  contentSellTooltip?: string;
  requiredStorage?: number;
  comparisonOptions?: WhyRecommendationOption[];
  /** Shown on the flip side when this card is not the recommended plan */
  recommendedPlanName?: string;
  /**
   * When true, this card is blurred and its actions are disabled (locked tier).
   * When false, card is interactive (recommended tier or adjacent smaller tier).
   */
  isRecommendationLocked?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  billingCycle,
  isRecommended,
  meetsRequirement,
  isContentSellBlocked = false,
  contentSellTooltip,
  requiredStorage = 0,
  comparisonOptions = [],
  recommendedPlanName,
  isRecommendationLocked = false
}) => {
  const [isFlipped, setIsFlipped] = React.useState(false);
  /** Parent passes true only for cards that should blur (not recommended + not companion tier). */
  const isLockedNonRecommended = isRecommendationLocked;
  const selectedOption = React.useMemo((): WhyRecommendationOption | undefined => {
    const existing = comparisonOptions.find((option) => option.name === plan.name);
    if (existing) return existing;
    if (requiredStorage <= 0) return undefined;
    const additionalGB = Math.max(0, requiredStorage - plan.storage);
    if (!isOnDemandWithinRegularLimit(additionalGB)) return undefined;
    const additionalCost = calculateOnDemandAdditionalCost(additionalGB, plan.name);
    const baseCost = plan.cost;
    const totalCost = baseCost * 12 + additionalCost;
    return { name: plan.name, baseCost, additionalGB, additionalCost, totalCost };
  }, [comparisonOptions, plan, requiredStorage]);
  const canGetStarted = meetsRequirement && !isContentSellBlocked && !isLockedNonRecommended;
  const extraGbRequired =
    requiredStorage > 0 ? Math.max(0, requiredStorage - plan.storage) : 0;
  const extraAnnualPayAsYouGoCost =
    extraGbRequired > 0 ? calculateOnDemandAdditionalCost(extraGbRequired, plan.name) : 0;

  const showInsightButton = requiredStorage > 0 && selectedOption !== undefined;

  return (
    <div
      className={`h-full [perspective:1200px] ${isLockedNonRecommended ? 'pointer-events-none select-none' : ''}`}
    >
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
          } ${isLockedNonRecommended ? 'blur-sm opacity-40' : ''}`}
        >
          {isRecommended && (
            <div className="bg-gradient-to-r from-[#594AE0] to-[#AD0FF0] text-white text-center py-2 px-4">
              <div className="flex items-center justify-center gap-2">
           
                <span className="text-xs font-semibold uppercase tracking-widest">Recommended Plan</span>
              </div>
            </div>
          )}

          <div className="p-6 flex flex-col flex-grow">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">{plan.name}</h3>

              <div className="mb-6">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-4xl font-semibold text-gray-900">
                    ${billingCycle === 'annual' ? Math.round(plan.cost) : plan.cost}
                  </span>
                  <span className="text-gray-600 text-base">/mo</span>
                  {extraAnnualPayAsYouGoCost > 0 && (
                    <span
                      className="inline-flex items-center gap-1.5 text-xl font-semibold text-[#AD0FF0] whitespace-nowrap"
                      title="Pay as you go"
                      aria-label="Pay as you go (annual on-demand upload)"
                    >
                      <Plus className="w-5 h-5 shrink-0" strokeWidth={2.5} aria-hidden />
                      <span>${Math.round(extraAnnualPayAsYouGoCost).toFixed(0)}</span>
                      <span className="text-sm font-medium text-[#AD0FF0]/85">/yr</span>
                      <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                        Pay as you go
                      </span>
                    </span>
                  )}
                </div>
                {billingCycle === 'annual' && plan.cost > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    ${(plan.cost * 12).toFixed(0)} billed annually
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 py-3 px-4 bg-gray-50 rounded border border-gray-200">
                <div className="flex items-center gap-2 flex-1">
                  {isRecommended ? (
                    <div className="text-left">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                        Upload quota
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">
                        {formatStorage(plan.storage)}
                      </p>
                      <p className="text-[11px] text-gray-500">per year</p>
                    </div>
                  ) : (
                    <>
                      <Database className="w-4 h-4 text-gray-600" />
                      <div className="text-left">
                        <p className="text-xs text-gray-500">Upload quota</p>
                        <p className="text-sm font-medium text-gray-900">{formatStorage(plan.storage)}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="flex items-center gap-2 flex-1">
                  {isRecommended ? (
                    <>
                      <div className="text-left min-w-0">
                        {extraGbRequired > 0 ? (
                          <>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                              Pay as you go
                            </p>
                            <p className="text-sm font-bold text-[#AD0FF0] mt-1 flex items-center gap-1">
                              <Plus className="w-3.5 h-3.5" strokeWidth={3} aria-hidden />
                              {`${Math.round(extraGbRequired)} GB`}
                            </p>
                            {/* <p className="text-[11px] font-semibold text-[#594AE0] uppercase tracking-wider">
                              overage included
                            </p> */}
                          </>
                        ) : (
                          <>
                            <Users className="w-4 h-4 text-gray-600" />
                            <div className="text-left">
                              <p className="text-xs text-gray-500">Users</p>
                              <p className="text-sm font-medium text-gray-900">{plan.users}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 text-gray-600" />
                      <div className="text-left">
                        <p className="text-xs text-gray-500">Users</p>
                        <p className="text-sm font-medium text-gray-900">{plan.users}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-6 flex-grow">
              {plan.features
                .filter((feature) => !feature.toLowerCase().startsWith('everything in'))
                .map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div
                      className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        isRecommended ? 'bg-[#594AE0]' : ''
                      }`}
                    >
                      <Check
                        className={`w-3.5 h-3.5 ${isRecommended ? 'text-white' : 'text-black'}`}
                      />
                    </div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
            </div>

            <div className="mt-auto">
              {showInsightButton && (
                <button
                  type="button"
                  className={`cursor-pointer w-full mb-3 py-2 rounded border text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    isRecommended
                      ? 'border-[#AD0FF0]/30 text-[#594AE0] bg-white hover:bg-[#AD0FF0]/10'
                      : 'border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100'
                  }`}
                  disabled={isLockedNonRecommended}
                  onClick={() => {
                    if (isLockedNonRecommended) return;
                    setIsFlipped(true);
                  }}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isRecommended ? 'bg-[#594AE0]/10' : 'bg-gray-100'
                    }`}
                  >
                    <HelpCircle className={`w-3.5 h-3.5 ${isRecommended ? 'text-[#594AE0]' : 'text-gray-600'}`} aria-hidden />
                  </span>
                  {isRecommended ? 'Price breakdown' : 'Price breakdown'}
                </button>
              )}

              {!meetsRequirement && !isContentSellBlocked && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  Insufficient upload quota for your needs
                </div>
              )}

              {isContentSellBlocked && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  Content sell feature is not available in this package.
                </div>
              )}

              {canGetStarted ? (
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
                  Get Started →
                </a>
              ) : (
                <button
                  className="w-full py-3 rounded font-medium text-sm transition-colors bg-gray-200 text-gray-500 cursor-not-allowed"
                  disabled
                  title={
                    isLockedNonRecommended
                      ? 'This plan is not recommended for your selected quota'
                      : isContentSellBlocked
                        ? contentSellTooltip
                        : undefined
                  }
                >
                  {isLockedNonRecommended ? 'Not Recommended' : 'Unavailable'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── BACK SIDE (redesigned) ── */}
        <div
          className={`absolute inset-0 rounded-lg bg-white shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden flex flex-col border ${
            isRecommended ? 'border-[#AD0FF0]' : 'border-gray-300'
          } ${isLockedNonRecommended ? 'blur-sm opacity-40' : ''}`}
        >
          {/* Header stripe */}
          <div
            className={`px-5 py-3 flex items-center justify-between flex-shrink-0 ${
              isRecommended
                ? 'bg-gradient-to-r from-[#594AE0] to-[#AD0FF0]'
                : 'bg-gradient-to-r from-gray-600 to-gray-700'
            }`}
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white">
                {isRecommended ? 'Price breakdown' : 'Price breakdown'}
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
              disabled={isLockedNonRecommended}
              onClick={() => {
                if (isLockedNonRecommended) return;
                setIsFlipped(false);
              }}
            >
              <EyeOff className="w-3 h-3" />
              Back
            </button>
          </div>

          <div className="flex flex-col flex-grow p-5 gap-4 overflow-auto">
            {!isRecommended && recommendedPlanName && (
              <p className="text-sm text-gray-600 rounded-lg bg-gray-50 border border-gray-100 p-3">
                For your required quota, <strong>{recommendedPlanName}</strong> is our recommended pick — it
                usually keeps your estimated yearly total lower than this tier for your usage.
              </p>
            )}

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
                      <span className="ml-1 text-xs text-gray-400">
                        ({formatStorage(selectedOption.additionalGB)})
                      </span>
                    </span>
                    <span className="font-medium text-gray-800">
                      ${selectedOption.additionalCost.toFixed(2)}/yr
                    </span>
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