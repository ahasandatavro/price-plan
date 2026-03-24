/**
 * Results Summary Component
 * Displays calculated storage requirements and recommended plan
 */

import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import type { BillingCycle, CalculationResult } from '../../types';
import {
  calculateOnDemandAdditionalCost,
  formatStorage
} from '../../utils/storage';
import {
  getBusinessAnnualTotalForStorage,
  getRangeComparisonForStorage
} from '../../utils/planRecommendation';
import {
  ENTERPRISE_ANNUAL_BASE_USD,
  ENTERPRISE_MIN_BUSINESS_ANNUAL_TOTAL_USD,
  ENTERPRISE_MIN_TOTAL_GB,
  MEDIAZILLA_ENTERPRISE_CONTACT_URL,
  PLANS
} from '../../constants/plans';

interface ResultsSummaryProps {
  result: CalculationResult;
  billingCycle: BillingCycle;
  sellContent: boolean;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ result, billingCycle, sellContent }) => {
  const calcRecommendedPlan = result.recommendedPlan;
  const shouldBlockStarter = billingCycle === 'annual' && sellContent;
  const shouldUseBusinessForMonthly =
    billingCycle === 'monthly' && (calcRecommendedPlan as any)?.isEnterprise === true;

  const recommendedPlan = shouldUseBusinessForMonthly
    ? ((result.allPlans as any).business ?? calcRecommendedPlan)
    : shouldBlockStarter &&
      calcRecommendedPlan &&
      !((calcRecommendedPlan as any)?.isEnterprise === true) &&
      calcRecommendedPlan.name === 'Starter'
      ? ((result.allPlans as any).growth ?? calcRecommendedPlan)
      : calcRecommendedPlan;

  const hasData = result.totalStorage > 0 && recommendedPlan;
  const isEnterprise = (recommendedPlan as any)?.isEnterprise === true;

  const [whyOpen, setWhyOpen] = useState(false);

  useEffect(() => {
    if (!whyOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setWhyOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [whyOpen]);

  const whyData = useMemo(() => {
    if (!recommendedPlan || result.totalStorage <= 0) return null;

    const requiredGB = result.totalStorage;
    const isEnterprise = (recommendedPlan as any).isEnterprise === true;
    const monthsInYear = 12;

    if (isEnterprise) {
      const baseCost = (recommendedPlan as any).baseCost ?? recommendedPlan.cost;
      const additionalCost = (recommendedPlan as any).additionalCost ?? 0;
      const businessPlan = (result.allPlans as any).business;
      const additionalGB = Math.max(0, requiredGB - (businessPlan?.storage ?? requiredGB));

      const businessAnnualPayAsYouGo = getBusinessAnnualTotalForStorage(requiredGB, PLANS);
      const hitStorageMinimum = requiredGB >= ENTERPRISE_MIN_TOTAL_GB;
      const hitBusinessAnnualCap = businessAnnualPayAsYouGo >= ENTERPRISE_MIN_BUSINESS_ANNUAL_TOTAL_USD;

      return {
        requiredGB,
        recommended: {
          name: recommendedPlan.name,
          baseCost,
          additionalGB,
          additionalCost,
          totalCost: baseCost * monthsInYear + additionalCost
        },
        enterpriseContext: {
          businessAnnualPayAsYouGo,
          hitStorageMinimum,
          hitBusinessAnnualCap
        },
        alternatives: [] as Array<{
          name: string;
          baseCost: number;
          additionalGB: number;
          additionalCost: number;
          totalCost: number;
        }>
      };
    }

    const comparison = getRangeComparisonForStorage(requiredGB, result.allPlans, billingCycle);
    const recommendedOption = comparison.options.find((option) => option.name === recommendedPlan.name);

    const fallbackAdditionalGB = Math.max(0, requiredGB - recommendedPlan.storage);
    const fallbackRawAdditionalCost = calculateOnDemandAdditionalCost(fallbackAdditionalGB, recommendedPlan.name);
    const fallbackAdditionalCost = fallbackRawAdditionalCost;
    const fallbackTotalCost = recommendedPlan.cost * monthsInYear + fallbackAdditionalCost;

    const recommendedCostData = recommendedOption ?? {
      name: recommendedPlan.name,
      baseCost: recommendedPlan.cost,
      additionalGB: fallbackAdditionalGB,
      additionalCost: fallbackAdditionalCost,
      totalCost: fallbackTotalCost
    };

    const alternatives = comparison.options.filter((option) => option.name !== recommendedCostData.name);

    return {
      requiredGB,
      recommended: {
        name: recommendedCostData.name,
        baseCost: recommendedCostData.baseCost,
        additionalGB: recommendedCostData.additionalGB,
        additionalCost: recommendedCostData.additionalCost,
        totalCost: recommendedCostData.totalCost
      },
      alternatives
    };
  }, [billingCycle, recommendedPlan, result.allPlans, result.totalStorage]);

  const userValue = recommendedPlan?.users;
  const userWord =
    typeof userValue === 'number'
      ? userValue === 1
        ? 'user'
        : 'users'
      : 'users';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mt-6">
      {hasData && recommendedPlan ? (
        <>
          {/* Storage Summary */}
          {!whyOpen && (
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Required Upload Quota</p>
                <p className="text-2xl font-semibold text-gray-900">{formatStorage(result.totalStorage)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">HD: {formatStorage(result.hdStorage)}</p>
                <p className="text-xs text-gray-500">4K: {formatStorage(result.fourKStorage)}</p>
              </div>
            </div>
          )}

          {/* Recommended Plan */}
          <div className="bg-gradient-to-r from-[#594AE0]/10 to-[#AD0FF0]/10 rounded border border-[#AD0FF0]/20 p-3">
            {!whyOpen ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-black" />
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Recommended</span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{recommendedPlan.name}</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {formatStorage(recommendedPlan.storage)}
                      {' • '}
                      {userValue} {userWord}
                    </p>
                  </div>
                  <div className="text-right">
                    {isEnterprise ? (
                      <>
                        <p className="text-2xl font-semibold text-gray-900">
                          ${(
                            (recommendedPlan as any).baseCost * 12 + (recommendedPlan as any).additionalCost
                          ).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-600">/year</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Annual: ${ENTERPRISE_ANNUAL_BASE_USD.toLocaleString()}/yr + Additional pre-paid quota
                          charges
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-2xl font-semibold text-gray-900">
                          ${billingCycle === 'annual' ? Math.round(recommendedPlan.cost) : recommendedPlan.cost.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-600">/month</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  {/* <button
                    type="button"
                    className="text-xs text-[#AD0FF0] underline hover:text-[#AD0FF0]/80 cursor-pointer"
                    onClick={() => setWhyOpen(true)}
                  >
                    Why recommended?
                  </button> */}
                </div>
              </>
            ) : (
              <>
                {whyData ? (
                  <div className="rounded-lg border border-[#AD0FF0]/20 overflow-hidden bg-white shadow-xl">
                    <div className="bg-gradient-to-r from-[#594AE0] to-[#AD0FF0] px-4 py-2.5 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white">Why Recommended</p>
                        <p className="text-sm font-semibold text-white mt-0.5">{whyData.recommended.name}</p>
                      </div>
                      <button
                        type="button"
                        className="text-xs text-white uppercase tracking-wider font-medium hover:text-white cursor-pointer"
                        onClick={() => setWhyOpen(false)}
                      >
                        Back
                      </button>
                    </div>

                    <div className="p-4 flex flex-col text-sm gap-1.5">
                      {isEnterprise ? (
                        <>
                          {'enterpriseContext' in whyData && whyData.enterpriseContext && (
                            <div className="text-xs text-gray-700 bg-amber-50 border border-amber-100 rounded px-3 py-2.5 mb-1 space-y-1.5">
                              <p className="font-medium text-amber-900">Why Enterprise (not Business)?</p>
                              {whyData.enterpriseContext.hitBusinessAnnualCap && (
                                <>
                                  <p>
                                    The <strong>${ENTERPRISE_MIN_BUSINESS_ANNUAL_TOTAL_USD}</strong> limit is for
                                    what <strong>Business would cost per year</strong> (annual base + $1/GB
                                    pay-as-you-go on extra quota) — not for your Enterprise pre-paid total.
                                  </p>
                                  <p>
                                    Business equivalent:{' '}
                                    <strong>
                                      ${whyData.enterpriseContext.businessAnnualPayAsYouGo.toFixed(2)}/yr
                                    </strong>{' '}
                                    (≥ ${ENTERPRISE_MIN_BUSINESS_ANNUAL_TOTAL_USD}, so Enterprise applies).
                                  </p>
                                </>
                              )}
                              {whyData.enterpriseContext.hitStorageMinimum && (
                                <p>
                                  Your required quota is at or above the Enterprise minimum (
                                  {formatStorage(ENTERPRISE_MIN_TOTAL_GB)} total).
                                </p>
                              )}
                            </div>
                          )}
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Enterprise base (annual)</span>
                            <span className="font-medium text-gray-800">
                              ${(whyData.recommended.baseCost * 12).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">
                              Pre-paid quota
                              <span className="ml-1 text-xs text-gray-400">
                                ({formatStorage(whyData.recommended.additionalGB)})
                              </span>
                            </span>
                            <span className="font-medium text-gray-800">
                              ${whyData.recommended.additionalCost.toFixed(2)}/yr
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-gray-500">Base plan / month</span>
                            <span className="font-medium text-gray-800">
                              $
                              {billingCycle === 'annual'
                                ? Math.round(whyData.recommended.baseCost)
                                : whyData.recommended.baseCost.toFixed(2)}
                            </span>
                          </div>
                          {billingCycle === 'annual' && (
                            <div className="flex items-center justify-between py-2 border-b border-gray-100">
                              <span className="text-gray-500">Annual billing cycle</span>
                              <span className="font-medium text-gray-800">
                                ${(whyData.recommended.baseCost * 12 + whyData.recommended.additionalCost).toFixed(0)}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="p-4 pt-0">
                      <div className="bg-gradient-to-r from-[#594AE0]/10 to-[#AD0FF0]/10 border border-[#AD0FF0]/20 rounded-lg px-4 py-3 flex items-center justify-between">
                        {billingCycle === 'monthly' ? (
                          <>
                            <span className="text-sm font-semibold text-[#AD0FF0]">Pay today</span>
                            <span className="text-lg font-bold text-[#AD0FF0]">
                              ${whyData.recommended.baseCost.toFixed(2)}
                              <span className="text-xs font-medium text-[#AD0FF0]/70">/month</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-sm font-semibold text-[#AD0FF0]">Pay today</span>
                            <span className="text-lg font-bold text-[#AD0FF0]">
                              ${(whyData.recommended.baseCost * 12).toFixed(0)}
                              <span className="text-xs font-medium text-[#AD0FF0]/70">/yr</span>
                            </span>
                          </>
                        )}
                      </div>

                      <a
                        href={
                          isEnterprise
                            ? MEDIAZILLA_ENTERPRISE_CONTACT_URL
                            : 'https://mediazilla.com/onboarding'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 w-full py-3 px-4 rounded font-medium text-sm transition-colors bg-gradient-to-r from-[#594AE0] to-[#AD0FF0] text-white hover:opacity-90 cursor-pointer block text-center"
                        onClick={() => setWhyOpen(false)}
                      >
                        Get Started
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 p-4">Details unavailable.</div>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-5 md:py-16 lg:py-24">
          <p className="text-gray-500 text-sm">
            Input values to show your required upload quota and pricing
          </p>
        </div>
      )}
    </div>
  );
};