import React from 'react';
import { marketNews } from '../data/stockData';

const MarketNews = () => {
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '📈';
      case 'negative': return '📉';
      default: return '📊';
    }
  };

  return (
    <div className="bg-slate-800 text-white p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        📰 Market News
      </h2>
      
      <div className="space-y-4">
        {marketNews.map((news) => (
          <div key={news.id} className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-blue-300 flex-1 pr-2">{news.title}</h3>
              <span className="text-xs text-gray-400">{news.timestamp}</span>
            </div>
            <p className="text-sm text-gray-300 mb-2">{news.summary}</p>
            <div className="flex items-center">
              <span className="text-sm mr-2">{getSentimentIcon(news.sentiment)}</span>
              <span className={`text-xs font-medium ${getSentimentColor(news.sentiment)}`}>
                {news.sentiment.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-blue-300 hover:text-blue-200 text-sm transition-colors">
        View All News →
      </button>
    </div>
  );
};

export default MarketNews;