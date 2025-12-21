/**
 * Calculator Form Component
 * Handles user input for storage calculation
 */

import React from 'react';
import { Video, HardDrive, DollarSign } from 'lucide-react';
import type { StorageInputs } from '../../types';

interface CalculatorFormProps {
  inputs: StorageInputs;
  onInputChange: (field: keyof StorageInputs, value: string) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ inputs, onInputChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <Video className="w-4 h-4" />
          Films per year
        </label>
        <input
          type="number"
          value={inputs.films}
          onChange={(e) => onInputChange('films', e.target.value)}
          placeholder="e.g., 50"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <HardDrive className="w-4 h-4" />
          Duration (minutes)
        </label>
        <input
          type="number"
          value={inputs.duration}
          onChange={(e) => onInputChange('duration', e.target.value)}
          placeholder="e.g., 120"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <DollarSign className="w-4 h-4" />
          4K Percentage (%)
        </label>
        <input
          type="number"
          value={inputs.fourKPercent}
          onChange={(e) => onInputChange('fourKPercent', e.target.value)}
          placeholder="e.g., 100"
          min="0"
          max="100"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition"
        />
      </div>
    </div>
  );
};

