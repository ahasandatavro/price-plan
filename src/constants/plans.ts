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
      cost: 51, 
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

/** Enterprise CTA — https://mediazilla.com/contact-us */
export const MEDIAZILLA_ENTERPRISE_CONTACT_URL = 'https://mediazilla.com/contact-us';

// Regular-plan on-demand availability is capped at 10.0TB additional quota.
export const ON_DEMAND_MAX_ADDITIONAL_GB = 10240;

// Annual billing discount percentage
export const ANNUAL_DISCOUNT_PERCENT = 16;

