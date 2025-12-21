/**
 * Main Application Component
 * Video Storage Plan Calculator
 */

import React from 'react';
import { Calculator } from 'lucide-react';
import { useStorageCalculator } from './hooks/useStorageCalculator';
import {
  CalculatorForm,
  BillingToggle,
  ResultsSummary,
  PlansGrid
} from './components';

const VideoStorageCalculator: React.FC = () => {
  const { inputs, updateInput, billingCycle, setBillingCycle, result } = useStorageCalculator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-800">Video Storage Plan Calculator</h1>
          </div>
          
          <p className="text-gray-600 mb-8">Answer three simple questions to find your perfect plan</p>

          <CalculatorForm inputs={inputs} onInputChange={updateInput} />

          <BillingToggle billingCycle={billingCycle} onToggle={setBillingCycle} />

          {result && result.totalStorage > 0 && <ResultsSummary result={result} billingCycle={billingCycle} />}
        </div>

        {result && <PlansGrid result={result} billingCycle={billingCycle} />}
      </div>
    </div>
  );
};

export default VideoStorageCalculator;
