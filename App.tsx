
import React, { useState, useCallback } from 'react';
import { getExchangeRate } from './services/geminiService';
import { CURRENCIES } from './constants';
import CurrencyInput from './components/CurrencyInput';
import SwapIcon from './components/SwapIcon';

const App: React.FC = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastConversion, setLastConversion] = useState<{from: string, to: string, rate: number} | null>(null);

  const handleConversion = useCallback(async () => {
    if (amount <= 0) {
      setError("Please enter an amount greater than zero.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setConvertedAmount(null);
    setLastConversion(null);

    try {
      const rate = await getExchangeRate(fromCurrency, toCurrency);
      const result = amount * rate;
      setConvertedAmount(result);
      setLastConversion({ from: fromCurrency, to: toCurrency, rate });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [amount, fromCurrency, toCurrency]);

  const handleSwapCurrencies = () => {
    const from = fromCurrency;
    const to = toCurrency;
    setFromCurrency(to);
    setToCurrency(from);
    if(convertedAmount) {
      setAmount(convertedAmount);
      setConvertedAmount(amount);
    }
    if(lastConversion) {
        setLastConversion({
            from: to,
            to: from,
            rate: 1 / lastConversion.rate
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            Currency Converter AI
          </h1>
          <p className="text-gray-400 mt-2">Powered by Gemini for real-time exchange rates</p>
        </header>
        
        <main>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-5/12">
              <CurrencyInput
                label="Amount"
                amount={amount}
                onAmountChange={setAmount}
                selectedCurrency={fromCurrency}
                onCurrencyChange={setFromCurrency}
                currencies={CURRENCIES}
              />
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={handleSwapCurrencies}
                className="p-3 bg-gray-700 rounded-full hover:bg-indigo-500 transition-all duration-300 ease-in-out transform hover:rotate-180 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label="Swap currencies"
              >
                <SwapIcon className="w-6 h-6 text-cyan-400" />
              </button>
            </div>
            
            <div className="w-full md:w-5/12">
               <CurrencyInput
                label="Converted To"
                amount={convertedAmount !== null ? convertedAmount : 0}
                onAmountChange={() => {}}
                selectedCurrency={toCurrency}
                onCurrencyChange={setToCurrency}
                currencies={CURRENCIES}
                isAmountDisabled={true}
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleConversion}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold py-4 px-4 rounded-lg text-lg hover:from-indigo-600 hover:to-cyan-600 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Converting...
                </>
              ) : (
                'Convert'
              )}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-900 bg-opacity-50 text-red-300 rounded-lg border border-red-700 text-center">
              {error}
            </div>
          )}

          {lastConversion && !isLoading && (
            <div className="mt-8 text-center bg-gray-900 bg-opacity-50 p-6 rounded-lg border border-gray-700">
              <p className="text-lg text-gray-400">Indicative Exchange Rate</p>
              <p className="text-3xl font-bold text-cyan-400 mt-2">
                1 {lastConversion.from} = {lastConversion.rate.toFixed(6)} {lastConversion.to}
              </p>
            </div>
          )}
        </main>
      </div>
       <footer className="text-center mt-8 text-gray-500">
        <p>Rates are provided by AI and may not be 100% accurate. For informational purposes only.</p>
      </footer>
    </div>
  );
};

export default App;
