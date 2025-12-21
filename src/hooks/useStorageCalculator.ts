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

  const calculateStorage = (): CalculationResult | null => {
    const films = parseFloat(inputs.films);
    const duration = parseFloat(inputs.duration);
    const fourKPercent = parseFloat(inputs.fourKPercent);

    if (!films || !duration || inputs.fourKPercent === '') {
      return null;
    }

    const { total, hd, fourK } = calculateTotalStorage(films, duration, fourKPercent);
    const currentPlans = PLANS[billingCycle];
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

