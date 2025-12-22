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
 * Get enterprise tier rate based on total storage amount
 * The rate is determined by which tier the TOTAL storage falls into,
 * then applied to additional storage beyond business plan (1.2 TB = 1228.8 GB)
 * 
 * Tiers:
 * - 0 TB - 1.2 TB (0 - 1228.8 GB): $0.9375 per GB (covered by business plan)
 * - 1.2 TB - 2.4 TB (1228.8 - 2457.6 GB): $0.875 per GB
 * - 2.4 TB - 5 TB (2457.6 - 5120 GB): $0.8125 per GB
 * - 5 TB - 10 TB (5120 - 10240 GB): $0.75 per GB
 */
export const getEnterpriseTierRate = (storageGB: number): number => {
  // Tiers are ordered from highest to lowest threshold
  // Return the rate for the first tier where storage exceeds the threshold
  for (const tier of ENTERPRISE_TIER_RATES) {
    if (storageGB > tier.threshold) {
      return tier.rate;
    }
  }
  // If storage is <= 1228.8 GB, it's covered by business plan (no additional charge)
  // But this shouldn't happen as enterprise plans only apply when storage > business plan
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




