/**
 * Calculator Form Component
 * Handles user input for storage calculation
 */

import React from 'react';
import { Film, Clock, Percent } from 'lucide-react';
import type { StorageInputs } from '../../types';

interface CalculatorFormProps {
  inputs: StorageInputs;
  onInputChange: (field: keyof StorageInputs, value: string) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ inputs, onInputChange }) => {
  const handlePercentChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.min(100, Math.max(0, numValue));
    onInputChange('fourKPercent', clampedValue.toString());
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculate Storage Requirements</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Films per year */}
        <div>
          <label htmlFor="films" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Film className="w-4 h-4 text-gray-500" />
            Films per Year
          </label>
          <input
            id="films"
            type="number"
            value={inputs.films}
            onChange={(e) => onInputChange('films', e.target.value)}
            placeholder="50"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 text-gray-500" />
            Duration (minutes)
          </label>
          <input
            id="duration"
            type="number"
            value={inputs.duration}
            onChange={(e) => onInputChange('duration', e.target.value)}
            placeholder="120"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
          />
        </div>

        {/* 4K Percentage */}
        <div>
          <label htmlFor="fourk-percent" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Percent className="w-4 h-4 text-gray-500" />
            4K Content (%)
          </label>
          <div className="relative">
            <input
              id="fourk-percent"
              type="number"
              value={inputs.fourKPercent}
              onChange={(e) => handlePercentChange(e.target.value)}
              onBlur={(e) => handlePercentChange(e.target.value)}
              placeholder="100"
              min="0"
              max="100"
              className="w-full px-3 py-2 pr-8 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
              %
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Max 100%</p>
        </div>
      </div>
    </div>
  );
};