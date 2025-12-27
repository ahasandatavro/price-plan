/**
 * Enterprise Plan Card Component
 * Displays custom enterprise plan with pricing breakdown
 */

import React from 'react';
import { Check, Star, Users, Database, Crown } from 'lucide-react';
import type { EnterprisePlan, BillingCycle } from '../../types';
import { formatStorage } from '../../utils/storage';

interface EnterprisePlanCardProps {
  plan: EnterprisePlan;
  billingCycle: BillingCycle;
}

export const EnterprisePlanCard: React.FC<EnterprisePlanCardProps> = ({ plan, billingCycle }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 border-2 border-purple-500 shadow-2xl flex flex-col h-full">
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white text-center py-3 px-4">
        <div className="flex items-center justify-center gap-2">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-bold tracking-wide">RECOMMENDED FOR YOU</span>
          <Star className="w-4 h-4 fill-current" />
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <Crown className="w-8 h-8 text-purple-600" />
            <h3 className="text-3xl font-bold text-gray-900">Enterprise</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Custom solution for your needs</p>
          
          <div className="mb-4">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ${plan.cost.toFixed(2)}
              </span>
              <span className="text-gray-500 text-lg font-medium">/mo</span>
            </div>
            {billingCycle === 'annual' && (
              <p className="text-xs text-gray-500 mt-2">Billed ${(plan.cost * 12).toFixed(2)} annually</p>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 py-4 px-6 bg-white/80 rounded-xl border border-purple-200 shadow-sm">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <p className="text-xs text-gray-500 font-medium">Storage</p>
                <p className="text-sm font-bold text-gray-900">{formatStorage(plan.storage)}</p>
              </div>
            </div>
            <div className="w-px h-10 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="text-xs text-gray-500 font-medium">Users</p>
                <p className="text-sm font-bold text-gray-900">5+</p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-5 rounded-xl mb-6 border border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-purple-700" />
            <p className="font-bold text-gray-900 text-sm">Pricing Breakdown</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Business Base Plan:</span>
              <span className="font-bold text-gray-900">${plan.baseCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Additional Storage:</span>
              <span className="font-bold text-gray-900">${plan.additionalCost.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-purple-300">
              <p className="text-xs text-gray-600">Rate: ${plan.tierRate}/GB for extra storage</p>
            </div>
          </div>
        </div> */}

        <div className="space-y-3 mb-6 flex-grow">
          {plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                <Check className="w-5 h-5 text-green-500 font-bold" />
              </div>
              <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <a
            href="https://mediazilla.com/onboarding"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer block text-center"
          >
            📞 Contact Sales Team
          </a>
          
          <p className="text-center text-xs text-gray-500 mt-3">
            Get a personalized quote and dedicated support
          </p>
        </div>
      </div>
    </div>
  );
};

