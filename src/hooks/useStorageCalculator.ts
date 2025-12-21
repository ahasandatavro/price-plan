/**
 * Custom hook for storage calculation logic
 */

import { useState, useEffect } from 'react';
import type { BillingCycle, CalculationResult, StorageInputs } from '../types';
import { PLANS } from '../constants/plans';
import { calculateTotalStorage } from '../utils/storage';
import { findRecommendedPlan } from '../utils/planRecommendation';

export const useStorageCalculator = () => {
  const [inputs, setInputs] = useState<StorageInputs>({
    films: '',
    duration: '',
    fourKPercent: ''
  });
  
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual');
  const [result, setResult] = useState<CalculationResult | null>(null);

  const updateInput = (field: keyof StorageInputs, value: string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const calculateStorage = (): CalculationResult => {
    const films = parseFloat(inputs.films);
    const duration = parseFloat(inputs.duration);
    const fourKPercent = parseFloat(inputs.fourKPercent);
    const currentPlans = PLANS[billingCycle];

    // If inputs are empty or invalid, return default result with all plans but no recommendation
    if (!films || !duration || inputs.fourKPercent === '') {
      return {
        totalStorage: 0,
        hdStorage: 0,
        fourKStorage: 0,
        recommendedPlan: null,
        allPlans: currentPlans
      };
    }

    // Calculate storage and find recommended plan
    const { total, hd, fourK } = calculateTotalStorage(films, duration, fourKPercent);
    const recommendedPlan = findRecommendedPlan(total, currentPlans);

    return {
      totalStorage: total,
      hdStorage: hd,
      fourKStorage: fourK,
      recommendedPlan,
      allPlans: currentPlans
    };
  };

  useEffect(() => {
    const newResult = calculateStorage();
    setResult(newResult);
  }, [inputs.films, inputs.duration, inputs.fourKPercent, billingCycle]);

  return {
    inputs,
    updateInput,
    billingCycle,
    setBillingCycle,
    result
  };
};

