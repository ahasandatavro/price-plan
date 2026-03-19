/**
 * Storage calculation utilities
 */

import {
  STORAGE_RATES,
  ENTERPRISE_TIER_RATES,
  DEFAULT_TIER_RATE,
  ON_DEMAND_TIER_RATES,
  ON_DEMAND_MAX_ADDITIONAL_GB
} from '../constants/plans';

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

/**
 * Calculate pay-as-you-go additional quota cost (one-time yearly).
 *
 * Tier selection is based on the size of the additional top-up amount (additionalGB),
 * not on total required storage.
 */
export const calculateOnDemandAdditionalCost = (additionalGB: number): number => {
  const safeAdditional = Math.max(0, additionalGB);
  if (safeAdditional === 0) return 0;

  let remaining = safeAdditional;
  let cost = 0;

  // Charge within defined tier ranges.
  for (const tier of ON_DEMAND_TIER_RATES) {
    const tierSize = tier.max - tier.min;
    const chunk = Math.min(remaining, tierSize);
    if (chunk <= 0) break;

    cost += chunk * tier.rate;
    remaining -= chunk;

    if (remaining <= 0) break;
  }

  // Overflow beyond the defined max tier span:
  // apply the last tier rate to remaining extra so enterprise can still price above 10TB.
  if (remaining > 0) {
    const lastRate = ON_DEMAND_TIER_RATES[ON_DEMAND_TIER_RATES.length - 1]?.rate ?? 0;
    cost += remaining * lastRate;
  }

  // Clamp tiny negatives from floating point edge cases.
  return Math.max(0, cost);
};

export interface OnDemandTierSelection {
  label: string;
  rate: number;
}

const ON_DEMAND_TIER_LABELS = [
  '0 TB - 1.2 TB',
  '1.2 TB - 2.4 TB',
  '2.4 TB - 5.0 TB',
  '5.0 TB - 10.0 TB'
] as const;

/**
 * Get the active on-demand tier based on additional top-up size.
 * This follows the same rule used for pricing tier selection by additionalGB.
 */
export const getOnDemandTierSelection = (additionalGB: number): OnDemandTierSelection | null => {
  const safeAdditional = Math.max(0, additionalGB);
  if (safeAdditional <= 0) return null;

  for (let index = 0; index < ON_DEMAND_TIER_RATES.length; index += 1) {
    const tier = ON_DEMAND_TIER_RATES[index];
    if (safeAdditional <= tier.max) {
      return {
        label: ON_DEMAND_TIER_LABELS[index] ?? `${(tier.min / 1024).toFixed(1)} TB - ${(tier.max / 1024).toFixed(1)} TB`,
        rate: tier.rate
      };
    }
  }

  const lastTier = ON_DEMAND_TIER_RATES[ON_DEMAND_TIER_RATES.length - 1];
  return {
    label: ON_DEMAND_TIER_LABELS[ON_DEMAND_TIER_LABELS.length - 1],
    rate: lastTier?.rate ?? 0
  };
};

const ENTERPRISE_PREPAID_TIER_RATES = [
  { min: 0, max: 1228.8, rate: 0.9375 },
  { min: 1228.8, max: 2457.6, rate: 0.875 },
  { min: 2457.6, max: 5120, rate: 0.8125 },
  { min: 5120, max: 10240, rate: 0.75 }
] as const;

const ENTERPRISE_TIER_LABELS = [
  '0 TB - 1.2 TB',
  '1.2 TB - 2.4 TB',
  '2.4 TB - 5.0 TB',
  '5.0 TB - 10.0 TB'
] as const;

export interface EnterpriseTierSelection {
  label: string;
  rate: number;
}

/**
 * Calculate enterprise prepaid additional quota cost beyond the included Business 1.2 TB.
 * Tier selection is based on additionalGB.
 */
export const calculateEnterpriseAdditionalCost = (additionalGB: number): number => {
  const safeAdditional = Math.max(0, additionalGB);
  if (safeAdditional === 0) return 0;

  let remaining = safeAdditional;
  let cost = 0;

  for (const tier of ENTERPRISE_PREPAID_TIER_RATES) {
    const tierSize = tier.max - tier.min;
    const chunk = Math.min(remaining, tierSize);
    if (chunk <= 0) break;

    cost += chunk * tier.rate;
    remaining -= chunk;

    if (remaining <= 0) break;
  }

  if (remaining > 0) {
    const lastRate = ENTERPRISE_PREPAID_TIER_RATES[ENTERPRISE_PREPAID_TIER_RATES.length - 1]?.rate ?? 0;
    cost += remaining * lastRate;
  }

  return Math.max(0, cost);
};

/**
 * Get enterprise prepaid tier selected by additionalGB above business.
 */
export const getEnterpriseTierSelection = (additionalGB: number): EnterpriseTierSelection | null => {
  const safeAdditional = Math.max(0, additionalGB);
  if (safeAdditional <= 0) return null;

  for (let index = 0; index < ENTERPRISE_PREPAID_TIER_RATES.length; index += 1) {
    const tier = ENTERPRISE_PREPAID_TIER_RATES[index];
    if (safeAdditional <= tier.max) {
      return {
        label: ENTERPRISE_TIER_LABELS[index],
        rate: tier.rate
      };
    }
  }

  const lastTier = ENTERPRISE_PREPAID_TIER_RATES[ENTERPRISE_PREPAID_TIER_RATES.length - 1];
  return {
    label: ENTERPRISE_TIER_LABELS[ENTERPRISE_TIER_LABELS.length - 1],
    rate: lastTier?.rate ?? 0
  };
};

/**
 * Regular-plan on-demand availability cap (10.0TB additional quota).
 * Separate helper to keep UI logic readable.
 */
export const isOnDemandWithinRegularLimit = (additionalGB: number): boolean => {
  return Math.max(0, additionalGB) <= ON_DEMAND_MAX_ADDITIONAL_GB;
};




