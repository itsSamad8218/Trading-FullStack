import React from 'react';
import LineChartComponent from './charts/LineChart';
import AreaChartComponent from './charts/AreaChart';
import PieChartComponent from './charts/PieChart';
import BarChartComponent from './charts/BarChart';
import StatsCard from './StatsCard';
import Portfolio from './Portfolio';
import MarketNews from './MarketNews';
import { marketOverviewData } from '../data/stockData';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Market Overview</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span>Real-time data</span>
        </div>
      </div>
      
      {/* Market Index Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketOverviewData.map((market, index) => (
          <StatsCard 
            key={index}
            title={market.index}
            value={market.value}
            change={market.change}
            changePercent={market.changePercent}
            trend={market.trend}
            isMarketIndex={true}
          />
        ))}
      </div>
      
      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">S&P 500 Trend</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded">1D</button>
              <button className="px-3 py-1 text-xs bg-slate-600 text-gray-300 rounded hover:bg-slate-500">1W</button>
              <button className="px-3 py-1 text-xs bg-slate-600 text-gray-300 rounded hover:bg-slate-500">1M</button>
            </div>
          </div>
          <AreaChartComponent />
        </div>
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Trading Volume</h2>
          <BarChartComponent />
        </div>
      </div>
      
      {/* Portfolio and Market Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Portfolio />
        </div>
        <div>
          <MarketNews />
        </div>
      </div>
      
      {/* Sector Performance and Technical Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Sector Performance</h2>
          <PieChartComponent />
        </div>
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Price Movement</h2>
          <LineChartComponent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;