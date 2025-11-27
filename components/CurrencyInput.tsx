import React from 'react';
import type { Currency } from '../types';
import CurrencyDropdown from './CurrencyDropdown';

interface CurrencyInputProps {
  label: string;
  amount: number;
  onAmountChange: (value: number) => void;
  selectedCurrency: string;
  onCurrencyChange: (value: string) => void;
  currencies: Currency[];
  isAmountDisabled?: boolean;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  amount,
  onAmountChange,
  selectedCurrency,
  onCurrencyChange,
  currencies,
  isAmountDisabled = false,
}) => {
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string to clear input, otherwise parse as float
    onAmountChange(value === '' ? 0 : parseFloat(value));
  };
  
  const formattedAmount = () => {
    if (isAmountDisabled) {
      if (amount === 0) return '';
      // Format with commas and up to 4 decimal places
      return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
      });
    }
    return amount === 0 ? '' : amount;
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      <div className="flex rounded-lg shadow-sm bg-gray-900 border border-gray-700 focus-within:ring-2 focus-within:ring-indigo-500 transition-all duration-200">
        <input
          type="number"
          value={formattedAmount()}
          onChange={handleAmountChange}
          disabled={isAmountDisabled}
          className="w-full p-3 bg-transparent text-white text-lg font-mono focus:outline-none disabled:text-gray-400 disabled:cursor-not-allowed rounded-l-lg"
          placeholder="0.00"
          min="0"
        />
        <div className="border-l border-gray-700">
          <CurrencyDropdown
            selectedCurrency={selectedCurrency}
            onCurrencyChange={onCurrencyChange}
            currencies={currencies}
          />
        </div>
      </div>
    </div>
  );
};

export default CurrencyInput;
