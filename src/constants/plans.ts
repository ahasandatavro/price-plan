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
      cost: 21, 
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
      cost: 37, 
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
      cost: 94, 
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

// Annual billing discount percentage
export const ANNUAL_DISCOUNT_PERCENT = 16;

