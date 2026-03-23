/**
 * Storage calculation utilities
 */

import {
  STORAGE_RATES,
  ENTERPRISE_TIER_RATES,
  DEFAULT_TIER_RATE,
  PAY_AS_YOU_GO_PER_GB_BY_PLAN,
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
    const tb = gb / 1024;
    const rounded = Math.round(tb * 10) / 10;
    return `${rounded.toFixed(rounded % 1 === 0 ? 0 : 1)} TB`;
  }

  if (Number.isInteger(gb)) return `${gb.toFixed(0)} GB`;

  // Visualization rounding: snap to nearest even whole number.
  // Examples: 45.48 -> 44, 45.83 -> 46
  const whole = Math.floor(gb);
  const fractional = gb - whole;
  const evenDown = whole % 2 === 0 ? whole : whole - 1;
  const evenUp = whole % 2 === 0 ? whole + 2 : whole + 1;
  const visualized = fractional >= 0.5 ? evenUp : evenDown;
  return `${Math.max(0, visualized)} GB`;
};

/**
 * $/GB for Pay As You Go top-ups for the given plan name (Starter, Growth, Pro, Business).
 */
export const getPayAsYouGoRatePerGb = (planName: string): number => {
  const rate = PAY_AS_YOU_GO_PER_GB_BY_PLAN[planName];
  if (typeof rate === 'number') return rate;
  // Monthly catalog has no Starter; default to Growth tier rate for unknown names.
  return PAY_AS_YOU_GO_PER_GB_BY_PLAN.Growth ?? 1.25;
};

/**
 * Calculate pay-as-you-go additional quota cost (one-time yearly).
 * Rate depends on which plan tier the top-up applies to (not volume bands).
 */
export const calculateOnDemandAdditionalCost = (additionalGB: number, planName: string): number => {
  const safeAdditional = Math.max(0, additionalGB);
  if (safeAdditional === 0) return 0;
  const ratePerGb = getPayAsYouGoRatePerGb(planName);
  return Math.max(0, safeAdditional * ratePerGb);
};

export interface OnDemandTierSelection {
  label: string;
  rate: number;
}

/**
 * Pay-as-you-go tier info for display (plan-based rate).
 */
export const getPayAsYouGoTierInfo = (planName: string): OnDemandTierSelection | null => {
  const rate = getPayAsYouGoRatePerGb(planName);
  return {
    label: `${planName} tier`,
    rate
  };
};

/** Pre-paid quota after first 1.2 TB included (additional GB beyond Business storage). */
const ENTERPRISE_PREPAID_TIER_RATES = [
  { min: 0, max: 1228.8, rate: 0.875 }, // 0 TB - 1.2 TB additional
  { min: 1228.8, max: 5120, rate: 0.8125 } // 1.2 TB - 5 TB additional
] as const;

const ENTERPRISE_PREPAID_LABELS = [
  '0 TB - 1.2 TB (pre-paid)',
  '1.2 TB - 5 TB (pre-paid)',
  '5.1 TB+ (pre-paid)'
] as const;

const ENTERPRISE_PREPAID_OVERFLOW_RATE = 0.75;

export interface EnterpriseTierSelection {
  label: string;
  rate: number;
}

/**
 * Calculate enterprise **pre-paid** additional quota cost beyond the included 1.2 TB.
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
    cost += remaining * ENTERPRISE_PREPAID_OVERFLOW_RATE;
  }

  return Math.max(0, cost);
};

/**
 * Primary pre-paid tier label/rate for display (by additional GB).
 */
export const getEnterpriseTierSelection = (additionalGB: number): EnterpriseTierSelection | null => {
  const safeAdditional = Math.max(0, additionalGB);
  if (safeAdditional <= 0) return null;

  if (safeAdditional <= ENTERPRISE_PREPAID_TIER_RATES[0].max) {
    return {
      label: ENTERPRISE_PREPAID_LABELS[0],
      rate: ENTERPRISE_PREPAID_TIER_RATES[0].rate
    };
  }
  if (safeAdditional <= ENTERPRISE_PREPAID_TIER_RATES[1].max) {
    return {
      label: ENTERPRISE_PREPAID_LABELS[1],
      rate: ENTERPRISE_PREPAID_TIER_RATES[1].rate
    };
  }
  return {
    label: ENTERPRISE_PREPAID_LABELS[2],
    rate: ENTERPRISE_PREPAID_OVERFLOW_RATE
  };
};

/**
 * Regular-plan on-demand availability cap (10.0TB additional quota).
 * Separate helper to keep UI logic readable.
 */
export const isOnDemandWithinRegularLimit = (additionalGB: number): boolean => {
  return Math.max(0, additionalGB) <= ON_DEMAND_MAX_ADDITIONAL_GB;
};




