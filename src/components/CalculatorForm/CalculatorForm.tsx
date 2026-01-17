/**
 * Calculator Form Component
 * Handles user input for storage calculation
 */

import React from 'react';
import { Film, Clock } from 'lucide-react';
import type { StorageInputs } from '../../types';

interface CalculatorFormProps {
  inputs: StorageInputs;
  onInputChange: (field: keyof StorageInputs, value: string) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ inputs, onInputChange }) => {
  // Filter out non-numeric characters
  const filterNumeric = (value: string): string => {
    return value.replace(/[^0-9]/g, '');
  };

  // Handle numeric input change
  const handleNumericChange = (field: keyof StorageInputs, value: string) => {
    const numericValue = filterNumeric(value);
    onInputChange(field, numericValue);
  };

  // Prevent non-numeric key presses
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, arrow keys
    if ([8, 9, 27, 13, 46, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  // Handle paste events to filter non-numeric content
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, field: keyof StorageInputs) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const numericValue = filterNumeric(pastedText);
    if (numericValue) {
      onInputChange(field, numericValue);
    }
  };

  const handlePercentChange = (value: string) => {
    const numericValue = filterNumeric(value);
    const numValue = parseInt(numericValue) || 0;
    const clampedValue = Math.min(100, Math.max(0, numValue));
    onInputChange('fourKPercent', clampedValue.toString());
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculate Upload Quota Requirements</h3>
      
      <div className="grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Films per year */}
        <div>
          <label htmlFor="films" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Film className="w-4 h-4 text-gray-500" />
            How many films do you shoot each year
          </label>
          <input
            id="films"
            type="number"
            value={inputs.films}
            onChange={(e) => handleNumericChange('films', e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={(e) => handlePaste(e, 'films')}
            placeholder="eg.50 films"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="duration" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Clock className="w-4 h-4 text-gray-500" />
            What is the total duration of each film (minutes)
          </label>
          <input
            id="duration"
            type="number"
            value={inputs.duration}
            onChange={(e) => handleNumericChange('duration', e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={(e) => handlePaste(e, 'duration')}
            placeholder="eg.120min"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
          />
        </div>

        {/* 4K Percentage */}
        <div>
          <label htmlFor="fourk-percent" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        
            Percentage(%) of total film delivered in 4K 
          </label>
          <div className="relative">
            <input
              id="fourk-percent"
              type="number"
              value={inputs.fourKPercent}
              onChange={(e) => handlePercentChange(e.target.value)}
              onBlur={(e) => handlePercentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={(e) => {
                e.preventDefault();
                const pastedText = e.clipboardData.getData('text');
                const numericValue = filterNumeric(pastedText);
                if (numericValue) {
                  handlePercentChange(numericValue);
                }
              }}
              placeholder="eg.100%"
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