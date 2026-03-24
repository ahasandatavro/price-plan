/**
 * Calculator Form Component
 * Handles user input for storage calculation
 */

import React from 'react';

import type { StorageInputs } from '../../types';

interface CalculatorFormProps {
  inputs: StorageInputs;
  onInputChange: (field: keyof StorageInputs, value: string) => void;
  sellContent: boolean;
  onSellContentChange: (value: boolean) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({ inputs, onInputChange, sellContent, onSellContentChange }) => {
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

  const handleFourKFilmsChange = (value: string) => {
    const numericValue = filterNumeric(value);
    const numValue = parseInt(numericValue) || 0;
    const totalFilms = parseInt(inputs.films) || 0;
    const maxFilms = totalFilms > 0 ? totalFilms : Number.MAX_SAFE_INTEGER;
    const clampedValue = Math.min(maxFilms, Math.max(0, numValue));
    onInputChange('fourKPercent', clampedValue.toString());
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculate Upload Quota Requirements</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Projects in next 12 months */}
        <div>
          <label htmlFor="films" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">

            How many projects do you plan to deliver in the next 12 months?
          </label>
          <input
            id="films"
            type="number"
            value={inputs.films}
            onChange={(e) => handleNumericChange('films', e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={(e) => handlePaste(e, 'films')}
            placeholder="e.g. 50"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Average video length per project */}
        <div>
          <label htmlFor="duration" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2 ">
            What is the average length of videos per project (in mins)?
          </label>
          <input
            id="duration"
            type="number"
            value={inputs.duration}
            onChange={(e) => handleNumericChange('duration', e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={(e) => handlePaste(e, 'duration')}
            placeholder="e.g. 120"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
          />
        </div>

        {/* 4K video count */}
        <div>
          <label htmlFor="fourk-percent" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            Approximately how many of your videos are delivered in 4K?
          </label>
          <input
            id="fourk-percent"
            type="number"
            value={inputs.fourKPercent}
            onChange={(e) => handleFourKFilmsChange(e.target.value)}
            onBlur={(e) => handleFourKFilmsChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={(e) => {
              e.preventDefault();
              const pastedText = e.clipboardData.getData('text');
              const numericValue = filterNumeric(pastedText);
              if (numericValue) {
                handleFourKFilmsChange(numericValue);
              }
            }}
            placeholder="e.g. 20"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
          />
          <p className="text-xs text-gray-500 mt-1">
            Must not exceed your number of projects above.
          </p>
        </div>

        {/* Sell content (Yes/No buttons) */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">Do you want to sell content?</div>
          <div className="flex gap-3">
            <button
              type="button"
              className={`flex-1 py-2 rounded font-medium text-sm transition-colors border cursor-pointer ${
                sellContent
                  ? 'bg-gradient-to-r from-[#594AE0] to-[#AD0FF0] text-white border-transparent'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
              aria-pressed={sellContent}
              onClick={() => onSellContentChange(true)}
            >
              Yes
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded font-medium text-sm transition-colors border cursor-pointer ${
                !sellContent
                  ? 'bg-gradient-to-r from-[#594AE0] to-[#AD0FF0] text-white border-transparent'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
              }`}
              aria-pressed={!sellContent}
              onClick={() => onSellContentChange(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};