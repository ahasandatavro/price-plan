/**
 * Enterprise Plan Card Component
 * Displays custom enterprise plan with pricing breakdown
 */

import React from 'react';
import { Check, Users, Database, Eye, EyeOff } from 'lucide-react';
import type { EnterprisePlan, BillingCycle } from '../../types';
import { formatStorage } from '../../utils/storage';

interface EnterprisePlanCardProps {
  plan: EnterprisePlan;
  billingCycle: BillingCycle;
  requiredStorage?: number;
}

export const EnterprisePlanCard: React.FC<EnterprisePlanCardProps> = ({
  plan,
  requiredStorage = 0
}) => {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const additionalGB = Math.max(0, requiredStorage - 1228.8);
  const baseAnnualCost = plan.baseCost * 12;
  const totalAnnualCost = baseAnnualCost + plan.additionalCost;

  return (
    <div className="h-full [perspective:1200px]">
      <div
        className="relative h-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        <div className="relative rounded-lg overflow-hidden transition-all duration-200 flex flex-col h-full bg-white border border-[#AD0FF0] shadow-sm [backface-visibility:hidden]">
          <div className="bg-gradient-to-r from-[#594AE0] to-[#AD0FF0] text-white text-center py-2 px-4">
            <span className="text-xs font-semibold uppercase tracking-wider">Recommended</span>
          </div>

          <div className="p-6 flex flex-col flex-grow">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Enterprise</h3>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-semibold text-gray-900">
                    ${totalAnnualCost.toFixed(2)}
                  </span>
                  <span className="text-gray-600 text-base">/year</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {totalAnnualCost.toFixed(2)} billed annually
                </p>
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
              <button
                type="button"
                className=" cursor-pointer w-full mb-3 py-2 rounded border border-[#AD0FF0]/20 text-[#AD0FF0] bg-gradient-to-r from-[#594AE0]/10 to-[#AD0FF0]/10 text-sm font-medium hover:bg-gradient-to-r hover:from-[#594AE0]/20 hover:to-[#AD0FF0]/20 transition-colors flex items-center justify-center gap-2"
                onClick={() => setIsFlipped(true)}
              >
                <Eye className="w-4 h-4" />
                Why Recommended
              </button>

              <a
                href="https://mediazilla.com/onboarding"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded font-medium text-sm transition-colors bg-gradient-to-r from-[#594AE0] to-[#AD0FF0] text-white hover:opacity-90 cursor-pointer block text-center"
              >
                Contact Sales Team
              </a>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 rounded-lg border border-[#AD0FF0] bg-white shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden flex flex-col">
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
                    width: `${Math.min(
                      100,
                      plan.storage > 0 ? (requiredStorage / plan.storage) * 100 : 0
                    )}%`
                  }}
                />
              </div>

              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-gray-400">0</span>
                <span className="text-[10px] text-gray-400">{formatStorage(plan.storage)} included</span>
              </div>
            </div>

            {/* Cost breakdown */}
            <div className="flex flex-col gap-2 flex-grow">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">Cost Breakdown</p>

              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Business base (yearly)</span>
                  <span className="font-medium text-gray-800">${baseAnnualCost.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">
                    Extra quota
                    <span className="ml-1 text-xs text-gray-400">({formatStorage(additionalGB)})</span>
                  </span>
                  <span className="font-medium text-gray-800">${plan.additionalCost.toFixed(2)}/yr</span>
                </div>
              </div>

              {/* Total callout */}
              <div className="mt-auto bg-gradient-to-r from-[#594AE0]/10 to-[#AD0FF0]/10 border border-[#AD0FF0]/20 rounded-lg px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#AD0FF0]">Annual Total</span>
                <span className="text-lg font-bold text-[#AD0FF0]">
                  ${(plan.baseCost * 12 + plan.additionalCost).toFixed(2)}
                  <span className="text-xs font-medium text-[#AD0FF0]/70">/yr</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
