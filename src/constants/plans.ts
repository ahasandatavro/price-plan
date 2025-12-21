/**
 * Pricing plans configuration for the Video Storage Calculator
 */

import type { Plans } from '../types';

export const PLANS: Plans = {
  monthly: {
    free: { 
      name: 'Free', 
      cost: 0, 
      storage: 10, 
      users: 1,
      features: [
        '10 GB upload',
        '1-year streaming access',
        'Premium delivery & app viewing',
        'Allow video downloading',
        'Password-protected sharing'
      ]
    },
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
    free: { 
      name: 'Free', 
      cost: 0, 
      storage: 10, 
      users: 1,
      features: [
        '10 GB upload',
        '1-year streaming access',
        'Premium delivery & app viewing',
        'Allow video downloading',
        'Password-protected sharing'
      ]
    },
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

export const ENTERPRISE_TIER_RATES = [
  { threshold: 10240, rate: 0.65 },
  { threshold: 5120, rate: 0.65 },
  { threshold: 2457.6, rate: 0.72 },
  { threshold: 1228.8, rate: 0.80 }
] as const;

export const DEFAULT_TIER_RATE = 0.89;

