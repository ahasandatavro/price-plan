/**
 * Pricing plans configuration for the Video Storage Calculator
 */

import type { Plans } from '../types';

export const PLANS: Plans = {
  monthly: {
    growth: { 
      name: 'Growth', 
      cost: 44, 
      storage: 100, 
      users: 1,
      features: [
        '100 GB upload per year',
        'Everything in Starter plan',
        'Engagement analytics',
        'Advanced customization',
        'Sell videos and earn money'
      ]
    },
    pro: { 
      name: 'Pro', 
      cost: 61, 
      storage: 600, 
      users: 2,
      features: [
        '600 GB upload per year',
        'Up to 2 users',
        'Everything in Starter plan',
        'Engagement analytics',
        'Advanced customization',
        'Sell videos and earn money'
      ]
    },
    business: { 
      name: 'Business', 
      cost: 111, 
      storage: 1228.8, 
      users: 5,
      features: [
        '1.20 TB upload per year',
        'Up to 5 users',
        'Everything in Pro plan',
        'Video expert consultation',
        'Free integrations & migrations',
        'Premium customer support'
      ]
    }
  },
  annual: {
    starter: { 
      name: 'Starter', 
      // Keep underlying model as monthly subscription price;
      // annual display uses cost * 12.
      cost: 20.75, 
      storage: 50, 
      users: 1,
      features: [
        '50 GB upload per year',
        'Lifetime viewer access',
        'Unlimited video presentations',
        'Embed and share videos',
        'Advanced privacy controls',
        'Track delivered content'
      ]
    },
    growth: { 
      name: 'Growth', 
      // 36.5 * 12 = 438
      cost: 36.5, 
      storage: 100, 
      users: 1,
      features: [
        '100 GB upload per year',
        'Everything in Starter plan',
        'Engagement analytics',
        'Advanced customization',
        'Sell videos and earn money'
      ]
    },
    pro: { 
      name: 'Pro', 
      // 51.25 * 12 = 615
      cost: 51.25, 
      storage: 600, 
      users: 2,
      features: [
        '600 GB upload per year',
        'Up to 2 users',
        'Everything in Starter plan',
        'Engagement analytics',
        'Advanced customization',
        'Sell videos and earn money'
      ]
    },
    business: { 
      name: 'Business', 
      cost: 93.75, 
      storage: 1228.8, 
      users: 5,
      features: [
        '1.20 TB upload per year',
        'Up to 5 users',
        'Everything in Pro plan',
        'Video expert consultation',
        'Free integrations & migrations',
        'Premium customer support'
      ]
    }
  }
};

export const STORAGE_RATES = {
  HD_PER_MINUTE: 7 / 60,
  FOUR_K_PER_MINUTE: 16 / 60
} as const;

// Enterprise tier rates for additional storage beyond business plan (1.2 TB = 1228.8 GB)
// Rates are based on which tier the TOTAL storage falls into
// Business plan covers up to 1.2 TB, additional storage is charged based on tier
export const ENTERPRISE_TIER_RATES = [
  { threshold: 10240, rate: 0.75 },   // 5 TB - 10 TB: $0.75 per GB
  { threshold: 5120, rate: 0.8125 }, // 2.4 TB - 5 TB: $0.8125 per GB
  { threshold: 2457.6, rate: 0.875 }, // 1.2 TB - 2.4 TB: $0.875 per GB
  { threshold: 1228.8, rate: 0.9375 } // 0 TB - 1.2 TB: $0.9375 per GB (covered by business plan)
] as const;

export const DEFAULT_TIER_RATE = 0.9375;

/**
 * Pay As You Go — additional top-up pricing per GB by plan tier (yearly charge on extra quota).
 */
export const PAY_AS_YOU_GO_PER_GB_BY_PLAN: Record<string, number> = {
  Starter: 3.75,
  Growth: 1.25,
  Pro: 1.25,
  Business: 1
} as const;

/** Minimum total required storage (GB) to qualify for Enterprise (2.4 TB). */
export const ENTERPRISE_MIN_TOTAL_GB = 2.4 * 1024; // 2457.6 GB

/**
 * Business (annual) is capped at this yearly total in the product model.
 * If the computed Business annual total is this value or higher, recommend Enterprise instead.
 */
export const BUSINESS_ANNUAL_MAX_TOTAL_USD = 2174;

/** Recommend Enterprise when Business annual total (base + on-demand) is strictly above the cap. */
export const ENTERPRISE_MIN_BUSINESS_ANNUAL_TOTAL_USD = BUSINESS_ANNUAL_MAX_TOTAL_USD + 1; // 2175

/** Fixed Enterprise annual subscription before pre-paid add-ons. */
export const ENTERPRISE_ANNUAL_BASE_USD = 1125;

/**
 * Prepaid quota is charged on storage **beyond** the first 1.2 TB (Business included quota).
 * Cumulative additional GB boundaries (tier 2 ends at 2.6 TB additional; tier 3 is 2.61+ TB additional).
 */
export const ENTERPRISE_PREPAID_ADDITIONAL_GB = {
  /** First band: 0 TB – 1.2 TB additional (= 1228.8 GB). */
  tier1Max: 1228.8,
  /** Second band ends at 2.6 TB additional cumulative (= 2662.4 GB). */
  tier2Max: 2662.4
} as const;

/** Display copy + rates ($/GB) for Enterprise prepaid tiers (additional quota after first 1.2 TB). */
export const ENTERPRISE_PREPAID_RATE_TABLE = [
  { rangeLabel: '0 TB - 1.2 TB', rateUsdPerGb: 0.875 },
  { rangeLabel: '1.21 TB - 2.6 TB', rateUsdPerGb: 0.8125 },
  { rangeLabel: '2.61+ TB', rateUsdPerGb: 0.75 }
] as const;

/** UTM params for leads from the Quota Calculator (Vercel app). */
const QUOTA_CALCULATOR_UTM =
  '?utm_source=MZ_Website&utm_medium=Quota_Calculator&utm_campaign=20260325_QuotaCalculatorExperiment';

export const MEDIAZILLA_ONBOARDING_URL = `https://mediazilla.com/onboarding${QUOTA_CALCULATOR_UTM}`;

/** Enterprise CTA — contact sales */
export const MEDIAZILLA_ENTERPRISE_CONTACT_URL = `https://mediazilla.com/contact-us${QUOTA_CALCULATOR_UTM}`;

// Regular-plan on-demand availability is capped at 10.0TB additional quota.
export const ON_DEMAND_MAX_ADDITIONAL_GB = 10240;

// Annual billing discount percentage
export const ANNUAL_DISCOUNT_PERCENT = 16;

