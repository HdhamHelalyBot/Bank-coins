import React, { useState, useEffect, useRef } from 'react';
import type { Currency } from '../types';

interface CurrencyDropdownProps {
  selectedCurrency: string;
  onCurrencyChange: (value: string) => void;
  currencies: Currency[];
}

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({
  selectedCurrency,
  onCurrencyChange,
  currencies,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCurrencyInfo = currencies.find(c => c.code === selectedCurrency);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (code: string) => {
    onCurrencyChange(code);
    setIsOpen(false);
    setSearchTerm('');
  };
  
  const filteredCurrencies = currencies.filter(currency =>
    currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-36 p-3 bg-gray-800 text-white font-semibold focus:outline-none rounded-r-lg flex justify-between items-center"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedCurrencyInfo?.code}</span>
        <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-72 max-h-80 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg shadow-lg right-0">
          <div className="p-2 sticky top-0 bg-gray-800">
            <input
              type="text"
              placeholder="Search currency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 bg-gray-900 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
          </div>
          <ul role="listbox">
            {filteredCurrencies.length > 0 ? (
              filteredCurrencies.map((currency) => (
                <li
                  key={currency.code}
                  onClick={() => handleSelect(currency.code)}
                  className="p-3 hover:bg-indigo-600 cursor-pointer flex justify-between items-center text-sm"
                  role="option"
                  aria-selected={currency.code === selectedCurrency}
                >
                  <div>
                    <span className="font-bold">{currency.code}</span>
                    <span className="text-gray-400 ml-2">{currency.name}</span>
                  </div>
                  <span className="text-lg">{currency.symbol}</span>
                </li>
              ))
            ) : (
              <li className="p-3 text-center text-gray-500">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CurrencyDropdown;
