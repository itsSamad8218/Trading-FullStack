import React from 'react';

const StatsCard = ({ title, value, change, changePercent, trend, isMarketIndex = false }) => {
  const isPositive = trend === 'up' || (change && parseFloat(change.replace(/[^-\d.]/g, '')) >= 0);
  
  return (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-300 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-white mt-2">{value}</p>
          
          <div className="flex items-center mt-2">
            <div className={`flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              <svg 
                className={`w-4 h-4 mr-1 ${isPositive ? 'rotate-0' : 'rotate-180'}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span className="text-sm font-semibold">
                {change}
              </span>
              {changePercent && (
                <span className="text-xs ml-1">
                  ({changePercent})
                </span>
              )}
            </div>
          </div>
        </div>
        
        {!isMarketIndex && (
          <div className="ml-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isPositive ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              <svg 
                className={`w-6 h-6 ${isPositive ? 'text-green-400' : 'text-red-400'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isPositive ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} 
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;