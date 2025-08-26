import React, { useState, useEffect } from 'react';
import { generateLiveStockData } from '../data/stockData';

const StockTicker = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const updateStocks = () => {
      setStocks(generateLiveStockData());
    };

    updateStocks();
    const interval = setInterval(updateStocks, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 text-white py-2 overflow-hidden">
      <div className="animate-scroll flex whitespace-nowrap">
        {stocks.map((stock, index) => (
          <div key={index} className="inline-flex items-center mx-8">
            <span className="font-semibold text-blue-300">{stock.symbol}</span>
            <span className="ml-2 text-lg font-mono">${stock.price}</span>
            <span className={`ml-2 text-sm ${
              stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockTicker;