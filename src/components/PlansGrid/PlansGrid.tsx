/**
 * Plans Carousel Component
 * Displays all available plans in a carousel layout
 */

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalculationResult, BillingCycle, EnterprisePlan } from '../../types';
import { PlanCard } from '../PlanCard/PlanCard';
import { EnterprisePlanCard } from '../EnterprisePlanCard/EnterprisePlanCard';
import { isOnDemandWithinRegularLimit } from '../../utils/storage';
import { getRangeComparisonForStorage } from '../../utils/planRecommendation';

interface PlansGridProps {
  result: CalculationResult;
  billingCycle: BillingCycle;
  sellContent: boolean;
}

export const PlansGrid: React.FC<PlansGridProps> = ({ result, billingCycle, sellContent }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    slidesToScroll: 1,
    loop: false
  });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  const isEnterprisePlan = (plan: any): plan is EnterprisePlan => {
    return plan?.isEnterprise === true;
  };

  const hasCalculation = result.totalStorage > 0 && result.recommendedPlan !== null;
  const calcRecommendedPlan = result.recommendedPlan;
  const shouldBlockStarter = billingCycle === 'annual' && sellContent;
  const uiRecommendedPlan =
    shouldBlockStarter &&
    calcRecommendedPlan &&
    !isEnterprisePlan(calcRecommendedPlan) &&
    calcRecommendedPlan.name === 'Starter'
      ? ((result.allPlans as any).growth ?? calcRecommendedPlan)
      : calcRecommendedPlan;
  const rangeComparison = hasCalculation
    ? getRangeComparisonForStorage(result.totalStorage, result.allPlans, billingCycle)
    : { options: [] };

  // Sort plans so recommended plan appears first
  const planEntries = Object.entries(result.allPlans);
  const sortedPlans = [...planEntries].sort(([_keyA, planA], [_keyB, planB]) => {
    // Check if planA is recommended
    const isPlanARecommended = 
      hasCalculation &&
      uiRecommendedPlan !== null &&
      planA.name === uiRecommendedPlan.name &&
      !isEnterprisePlan(uiRecommendedPlan);
    
    // Check if planB is recommended
    const isPlanBRecommended = 
      hasCalculation &&
      uiRecommendedPlan !== null &&
      planB.name === uiRecommendedPlan.name &&
      !isEnterprisePlan(uiRecommendedPlan);
    
    // Recommended plan should come first
    if (isPlanARecommended && !isPlanBRecommended) return -1;
    if (!isPlanARecommended && isPlanBRecommended) return 1;
    return 0; // Keep original order for non-recommended plans
  });

  // Prepare all plans for carousel (including enterprise if recommended)
  const allPlansForCarousel: Array<{ type: 'enterprise' | 'regular'; key: string; plan: any }> = [];
  
  if (hasCalculation && uiRecommendedPlan && isEnterprisePlan(uiRecommendedPlan)) {
    allPlansForCarousel.push({
      type: 'enterprise',
      key: 'enterprise',
      plan: uiRecommendedPlan
    });
  }

  sortedPlans.forEach(([key, plan]) => {
    allPlansForCarousel.push({
      type: 'regular',
      key,
      plan
    });
  });

  return (
    <div className="mb-8 relative">
      <div className="text-center mb-12 relative">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
          Choose Your Perfect Plan
        </h2>
        <p className="text-lg text-gray-600">
          {hasCalculation 
            ? 'Select the plan that best fits your video upload quota needs'
            : 'Explore our available plans'}
        </p>

             {/* Navigation buttons */}
       <div className='pt-10'>
       <button
          className={`absolute cursor-pointer right-1/2 sm:right-25  -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors ${
            prevBtnDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={scrollPrev}
          disabled={prevBtnDisabled}
          aria-label="Previous plans"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <button
          className={`absolute cursor-pointer right-1/3 sm:right-10 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors ${
            nextBtnDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={scrollNext}
          disabled={nextBtnDisabled}
          aria-label="Next plans"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
       </div>

      </div>

      <div className="relative px-2">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-8">
            {allPlansForCarousel.map(({ type, key, plan }) => {
              if (type === 'enterprise') {
                return (
                  <div key={key} className="flex-[0_0_100%] md:flex-[0_0_calc(50%-1rem)] lg:flex-[0_0_calc(33.333%-1.33rem)] min-w-0">
                    <EnterprisePlanCard
                      plan={plan}
                      billingCycle={billingCycle}
                      requiredStorage={result.totalStorage}
                    />
                  </div>
                );
              }

              const isRecommended = 
                hasCalculation &&
                uiRecommendedPlan !== null &&
                plan.name === uiRecommendedPlan.name &&
                !isEnterprisePlan(uiRecommendedPlan);
              const onDemandAdditionalGB = hasCalculation ? Math.max(0, result.totalStorage - plan.storage) : 0;
              const meetsRequirement = !hasCalculation || isOnDemandWithinRegularLimit(onDemandAdditionalGB);
              const isStarterPlan = plan.name === 'Starter';
              const contentSellBlocked = billingCycle === 'annual' && sellContent && isStarterPlan;
              const contentSellTooltip = 'Content sell feature is not available in this package.';

              return (
                <div key={key} className="flex-[0_0_100%] md:flex-[0_0_calc(50%-1rem)] lg:flex-[0_0_calc(33.333%-1.33rem)] min-w-0">
                  <PlanCard
                    plan={plan}
                    billingCycle={billingCycle}
                    isRecommended={isRecommended}
                    meetsRequirement={meetsRequirement}
                    requiredStorage={result.totalStorage}
                    comparisonOptions={hasCalculation ? rangeComparison.options : []}
                    recommendedPlanName={
                      hasCalculation && uiRecommendedPlan ? uiRecommendedPlan.name : undefined
                    }
                    isContentSellBlocked={contentSellBlocked}
                    contentSellTooltip={contentSellTooltip}
                  />
                </div>
              );
            })}
          </div>
        </div>

       
      </div>
    </div>
  );
};

