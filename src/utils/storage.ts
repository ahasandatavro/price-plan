/**
 * Storage calculation utilities
 */

import { STORAGE_RATES, ENTERPRISE_TIER_RATES, DEFAULT_TIER_RATE } from '../constants/plans';

/**
 * Calculate HD storage requirements
 */
export const calculateHDStorage = (films: number, duration: number, hdPercent: number): number => {
  return films * duration * hdPercent * STORAGE_RATES.HD_PER_MINUTE;
};

/**
 * Calculate 4K storage requirements
 */
export const calculate4KStorage = (films: number, duration: number, fourKPercent: number): number => {
  return films * duration * fourKPercent * STORAGE_RATES.FOUR_K_PER_MINUTE;
};

/**
 * Calculate total storage requirements
 */
export const calculateTotalStorage = (
  films: number,
  duration: number,
  fourKPercent: number
): { total: number; hd: number; fourK: number } => {
  const fourKRatio = fourKPercent / 100;
  const hdRatio = 1 - fourKRatio;
  
  const hdStorage = calculateHDStorage(films, duration, hdRatio);
  const fourKStorage = calculate4KStorage(films, duration, fourKRatio);
  
  return {
    total: hdStorage + fourKStorage,
    hd: hdStorage,
    fourK: fourKStorage
  };
};

/**
 * Get enterprise tier rate based on storage amount
 */
export const getEnterpriseTierRate = (storageGB: number): number => {
  for (const tier of ENTERPRISE_TIER_RATES) {
    if (storageGB > tier.threshold) {
      return tier.rate;
    }
  }
  return DEFAULT_TIER_RATE;
};

/**
 * Format storage size with appropriate unit
 */
export const formatStorage = (gb: number): string => {
  if (gb >= 1024) {
    return `${(gb / 1024).toFixed(2)} TB`;
  }
  return `${gb.toFixed(2)} GB`;
};




