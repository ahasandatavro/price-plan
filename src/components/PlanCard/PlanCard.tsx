/**
 * Plan Card Component
 * Displays individual pricing plan details
 */

import React from 'react';
import { Check, Database, Eye, EyeOff, Users } from 'lucide-react';
import type { Plan, BillingCycle } from '../../types';
import { formatStorage, getOnDemandTierSelection } from '../../utils/storage';

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
  const alternativeOptions = comparisonOptions.filter((option) => option.name !== plan.name);

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
        <div
          className={`relative rounded-lg overflow-hidden transition-all duration-200 flex flex-col h-full [backface-visibility:hidden] ${
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
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              {isRecommended && (
                <button
                  type="button"
                  className=" cursor-pointer w-full mb-3 py-2 rounded border border-blue-200 text-blue-700 bg-blue-50 text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
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

        <div className="absolute inset-0 rounded-lg border border-blue-600 bg-white shadow-sm p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="h-full flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">Why Recommended</p>
                <h3 className="text-xl font-semibold text-gray-900 mt-1">{plan.name}</h3>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm text-blue-700 hover:text-blue-800 cursor-pointer"
                onClick={() => setIsFlipped(false)}
              >
                <EyeOff className="w-4 h-4" />
                Back
              </button>
            </div>

            <div className="text-sm text-gray-700 space-y-2 leading-relaxed flex-grow">
              <p>
                Required quota: <span className="font-medium">{formatStorage(requiredStorage)}</span>
              </p>
              {selectedOption ? (
                <p>
                  {selectedOption.name}: base ${selectedOption.baseCost.toFixed(2)} + on-demand{' '}
                  {selectedOption.additionalGB > 0
                    ? `${formatStorage(selectedOption.additionalGB)} ($${selectedOption.additionalCost.toFixed(2)})`
                    : '(no extra needed)'}{' '}
                  = <span className="font-medium">${selectedOption.totalCost.toFixed(2)}</span>
                </p>
              ) : (
                <p>Detailed breakdown unavailable for this recommendation.</p>
              )}

              {alternativeOptions.map((option) => (
                <p key={option.name}>
                  {option.name}: base ${option.baseCost.toFixed(2)} + on-demand{' '}
                  {option.additionalGB > 0
                    ? `${formatStorage(option.additionalGB)} ($${option.additionalCost.toFixed(2)})`
                    : '(no extra needed)'}{' '}
                  = <span className="font-medium">${option.totalCost.toFixed(2)}</span>
                </p>
              ))}

              <div className="mt-2 p-2 rounded border border-blue-100 bg-blue-50 text-xs">
                <p className="font-medium text-gray-900">On-demand tier rates</p>
                <p>0 TB - 1.2 TB: $1.110/GB</p>
                <p>1.2 TB - 2.4 TB: $1.00/GB</p>
                <p>2.4 TB - 5.0 TB: $0.90/GB</p>
                <p>5.0 TB - 10.0 TB: $0.82/GB</p>
                {(() => {
                  const selectedTier = getOnDemandTierSelection(selectedOption?.additionalGB ?? 0);
                  if (!selectedTier) {
                    return <p className="mt-1">Selected tier: no extra top-up needed</p>;
                  }
                  return (
                    <p className="mt-1 font-medium text-blue-700">
                      Selected tier: {selectedTier.label} at ${selectedTier.rate.toFixed(3)}/GB
                    </p>
                  );
                })()}
              </div>

              <p className="text-xs text-gray-500 pt-2">
                Comparison is done within the current storage range (current tier and next tier).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};