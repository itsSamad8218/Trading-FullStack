import React, { useMemo, useState } from 'react';
import { stockSymbols, generateHistoricalData } from '../data/stockData';

const companies = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corp.' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.' },
  { symbol: 'META', name: 'Meta Platforms, Inc.' },
  { symbol: 'NFLX', name: 'Netflix, Inc.' },
];

const Markets = ({ livePrices = {}, onBuy = () => {}, onSell = () => {} }) => {
  const [selected, setSelected] = useState('AAPL');
  const [quantity, setQuantity] = useState(1);

  const currentPrice = livePrices[selected] ?? generateHistoricalData(selected, 1).slice(-1)[0]?.price ?? 0;

  const handleBuyClick = () => {
    onBuy(selected, Number(quantity), currentPrice);
  };

  const handleSellClick = () => {
    onSell(selected, Number(quantity), currentPrice);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Markets</h1>
        <div className="text-gray-300">Live quotes update every 3s</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-lg border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-blue-300 font-semibold text-xl">{selected}</div>
              <div className="text-gray-400 text-sm">{companies.find(c => c.symbol === selected)?.name}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">${currentPrice?.toFixed(2)}</div>
              <div className="text-gray-400 text-xs">Est. price</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {companies.map(company => (
              <button
                key={company.symbol}
                onClick={() => setSelected(company.symbol)}
                className={`p-3 rounded-lg border text-left transition-colors ${selected === company.symbol ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-700 text-gray-200 border-slate-600 hover:bg-slate-600'}`}
              >
                <div className="font-semibold">{company.symbol}</div>
                <div className="text-xs text-gray-300">${(livePrices[company.symbol] ?? 0).toFixed(2)}</div>
                <div className="text-xs text-gray-400 truncate">{company.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Trade</h2>
          <label className="block text-sm text-gray-300 mb-2">Symbol</label>
          <input value={selected} disabled className="w-full bg-slate-700 text-white rounded px-3 py-2 mb-4 border border-slate-600" />
          <label className="block text-sm text-gray-300 mb-2">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            className="w-full bg-slate-700 text-white rounded px-3 py-2 mb-4 border border-slate-600"
          />
          <div className="flex gap-3">
            <button onClick={handleBuyClick} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">Buy</button>
            <button onClick={handleSellClick} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg">Sell</button>
          </div>
          <div className="mt-4 text-sm text-gray-400">Total: ${(currentPrice * Number(quantity) || 0).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default Markets;


