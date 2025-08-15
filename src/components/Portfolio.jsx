import React from 'react';

const Portfolio = ({ portfolio = [] }) => {
  const totalValue = portfolio.reduce((sum, stock) => sum + stock.totalValue, 0);
  const totalInvested = portfolio.reduce((sum, stock) => sum + (stock.avgPrice * stock.shares), 0);
  const totalGainLoss = totalValue - totalInvested;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  return (
    <div className="bg-slate-800 text-white p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Portfolio</h2>
        <div className="text-right">
          <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
          <div className={`text-sm ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toFixed(2)} ({totalGainLossPercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {portfolio.map((stock, index) => (
          <div key={index} className="flex justify-between items-center p-4 bg-slate-700 rounded-lg">
            <div>
              <div className="font-semibold text-blue-300">{stock.symbol}</div>
              <div className="text-sm text-gray-400">{stock.shares} shares @ ${stock.avgPrice}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">${stock.currentPrice}</div>
              <div className={`text-sm ${stock.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stock.gainLoss >= 0 ? '+' : ''}${stock.gainLoss.toFixed(2)}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold">${stock.totalValue.toLocaleString()}</div>
              <div className={`text-sm ${stock.gainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stock.gainLossPercent >= 0 ? '+' : ''}{stock.gainLossPercent.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        Trades appear here after you buy/sell in Markets.
      </div>
    </div>
  );
};

export default Portfolio;